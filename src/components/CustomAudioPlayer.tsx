import * as React from 'react';
import { audioStore, type AudioState } from '../stores/audioStore';

const { useState, useEffect, useRef, useCallback } = React;

interface WaveformProps {
  waveformData: number[];
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

function Waveform({ waveformData, currentTime, duration, onSeek }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !waveformData.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = container.getBoundingClientRect();
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    ctx.clearRect(0, 0, width, height);

    // Get computed styles to access CSS variables
    const computedStyle = getComputedStyle(container);
    const mainColor = computedStyle.getPropertyValue('--color-main').trim();

    const barWidth = width / waveformData.length;
    const progress = duration > 0 ? currentTime / duration : 0;
    const progressX = progress * width;

    waveformData.forEach((amplitude, index) => {
      const x = index * barWidth;
      const barHeight = amplitude * height * 0.8;
      const y = (height - barHeight) / 2;

      // All waves use main color, with opacity for unplayed sections
      ctx.fillStyle = mainColor || '#000000'; // Fallback to black if CSS var not found
      ctx.globalAlpha = x < progressX ? 1 : 0.3;
      
      ctx.fillRect(x, y, Math.max(barWidth - 1, 1), barHeight);
    });

    // Reset alpha
    ctx.globalAlpha = 1;

    // Progress line
    ctx.strokeStyle = mainColor || '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(progressX, 0);
    ctx.lineTo(progressX, height);
    ctx.stroke();
  }, [waveformData, currentTime, duration]);

  useEffect(() => {
    draw();
    
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  const handleClick = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container || !duration) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = x / rect.width;
    const time = progress * duration;
    onSeek(time);
  };

  return (
    <div 
      ref={containerRef}
      className="relative h-16 bg-secondary border border-main cursor-pointer hover:opacity-90 rounded-lg p-2"
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] rounded-md"
        style={{ width: 'calc(100% - 16px)', height: 'calc(100% - 16px)' }}
      />
    </div>
  );
}

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  onClose: () => void;
}

export default function CustomAudioPlayer({ audioUrl, title, onClose }: AudioPlayerProps) {
  const [state, setState] = useState<AudioState>(audioStore.getState());
  const audioRef = useRef<HTMLAudioElement>(null);
  const speedDropdownRef = useRef<HTMLDivElement>(null);
  const [isGeneratingWaveform, setIsGeneratingWaveform] = useState(false);
  const [speedDropdownOpen, setSpeedDropdownOpen] = useState(false);

  const playbackRates = [0.75, 1, 1.25, 1.5, 1.75, 2];

  // Subscribe to store changes
  useEffect(() => {
    const unsubscribe = audioStore.subscribe(setState);
    return unsubscribe;
  }, []);

  // Set audio element reference in store
  useEffect(() => {
    if (audioRef.current) {
      audioStore.setAudioElement(audioRef.current);
    }
  }, []);

  // Update audio element properties when state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
      audioRef.current.playbackRate = state.playbackRate;
    }
  }, [state.volume, state.playbackRate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (speedDropdownRef.current && !speedDropdownRef.current.contains(event.target as Node)) {
        setSpeedDropdownOpen(false);
      }
    };

    if (speedDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [speedDropdownOpen]);

  // Generate waveform data when audio loads
  const generateWaveform = useCallback(async (audioElement: HTMLAudioElement) => {
    if (!audioElement.src || isGeneratingWaveform) return;
    
    setIsGeneratingWaveform(true);
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const response = await fetch(audioElement.src);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const channelData = audioBuffer.getChannelData(0);
      const duration = audioBuffer.duration;
      const sampleRate = audioBuffer.sampleRate;
      
      // Fixed 1000 bars total, distributed across entire audio
      const samples = 1000;
      const samplesPerBar = channelData.length / samples;
      const waveformData: number[] = [];
      
      for (let i = 0; i < samples; i++) {
        const start = Math.floor(i * samplesPerBar);
        const end = Math.min(Math.floor((i + 1) * samplesPerBar), channelData.length);
        let sum = 0;
        let count = 0;
        
        for (let j = start; j < end; j++) {
          sum += Math.abs(channelData[j] || 0);
          count++;
        }
        
        waveformData.push(count > 0 ? sum / count : 0);
      }
      
      // Normalize
      const max = Math.max(...waveformData, 0.001); // Prevent division by zero
      const normalized = waveformData.map(value => value / max);
      
      audioStore.setWaveformData(normalized);
    } catch (error) {
      console.error('Error generating waveform:', error);
      // Fallback: generate fake waveform data - always 1000 bars
      const samples = 1000;
      const fakeData = Array.from({ length: samples }, () => Math.random() * 0.8 + 0.1);
      audioStore.setWaveformData(fakeData);
    } finally {
      setIsGeneratingWaveform(false);
    }
  }, [isGeneratingWaveform]);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      audioStore.updatePlayback(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioStore.updatePlayback(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      audioStore.updatePlayback(
        state.isPlaying,
        audioRef.current.currentTime,
        audioRef.current.duration
      );
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      audioStore.updatePlayback(
        state.isPlaying,
        audioRef.current.currentTime,
        audioRef.current.duration
      );
      generateWaveform(audioRef.current);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    audioStore.setVolume(volume);
  };

  const handleMuteToggle = () => {
    audioStore.toggleMute();
  };

  const handlePlaybackRateChange = (rate: number) => {
    audioStore.setPlaybackRate(rate);
  };

  const handleSeek = (time: number) => {
    audioStore.seekTo(time);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-main border-t-2 border-secondary p-3">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        preload="metadata"
      />

      {/* Header with quick play/pause */}
      <div className="flex items-center gap-3 mb-3">
        {/* Quick Play/Pause Button */}
        <button
          onClick={state.isPlaying ? handlePause : handlePlay}
          className="w-8 h-8 bg-secondary text-main border border-secondary hover:bg-main hover:text-secondary font-mono text-sm font-bold flex items-center justify-center flex-shrink-0"
        >
          {state.isPlaying ? '⏸' : '▶'}
        </button>

        {/* Title and time */}
        <div className="flex-1 min-w-0">
          <h3 className="text-secondary font-mono text-sm font-bold truncate">
            {title}
          </h3>
          <div className="text-secondary font-mono text-xs opacity-70">
            {formatTime(state.currentTime)} / {formatTime(state.duration)}
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="w-6 h-6 bg-secondary text-main border border-secondary hover:bg-main hover:text-secondary font-mono text-xs font-bold flex items-center justify-center flex-shrink-0"
          aria-label="Cerrar reproductor"
        >
          ×
        </button>
      </div>

      {/* Waveform */}
      <div className="mb-3">
        {state.waveformData ? (
          <Waveform
            waveformData={state.waveformData}
            currentTime={state.currentTime}
            duration={state.duration}
            onSeek={handleSeek}
          />
        ) : (
          <div className="h-16 bg-secondary border border-main flex items-center justify-center rounded-lg p-2">
            <span className="text-main font-mono text-xs">
              {isGeneratingWaveform ? 'Generando...' : 'Cargando...'}
            </span>
          </div>
        )}
      </div>

      {/* Compact Controls */}
      <div className="flex items-center justify-between gap-4">
        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleMuteToggle}
            className="w-6 h-6 bg-secondary text-main border border-secondary hover:bg-main hover:text-secondary font-mono text-xs font-bold flex items-center justify-center"
            aria-label={state.isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {state.isMuted ? '🔇' : '🔊'}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={state.volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-secondary border border-main"
          />
          <span className="text-secondary font-mono text-xs w-6">
            {Math.round(state.volume * 100)}%
          </span>
        </div>

        {/* Playback Speed Dropdown */}
        <div className="relative" ref={speedDropdownRef}>
          {/* Dropdown Menu (appears above) */}
          {speedDropdownOpen && (
            <div className="absolute bottom-full mb-1 right-0 bg-main border border-secondary shadow-[2px_2px_0_var(--color-secondary)] z-10 min-w-[60px]">
              {playbackRates.map((rate) => (
                <button
                  key={rate}
                  onClick={() => {
                    handlePlaybackRateChange(rate);
                    setSpeedDropdownOpen(false);
                  }}
                  className={`block w-full px-3 py-1 text-left font-mono text-xs border-b border-secondary last:border-b-0 ${
                    state.playbackRate === rate
                      ? 'bg-secondary text-main'
                      : 'bg-main text-secondary hover:bg-secondary hover:text-main'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          )}
          
          {/* Speed Button */}
          <button
            onClick={() => setSpeedDropdownOpen(!speedDropdownOpen)}
            className="flex items-center gap-1 px-2 py-1 bg-secondary text-main border border-secondary hover:bg-main hover:text-secondary font-mono text-xs"
          >
            <span>{state.playbackRate}x</span>
            <span className="text-xs">▲</span>
          </button>
        </div>
      </div>
    </div>
  );
}