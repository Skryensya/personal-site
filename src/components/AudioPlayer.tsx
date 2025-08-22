import * as React from 'react';
import { Play, Pause, Volume2, VolumeX, X } from 'lucide-react';

const { useState, useEffect, useRef, useMemo, useCallback } = React;

type AudioPlayerState = {
  readonly isVisible: boolean;
  readonly audioUrl: string;
  readonly title: string;
  readonly isPlaying: boolean;
  readonly currentTime: number;
  readonly duration: number;
  readonly volume: number;
  readonly isMuted: boolean;
  readonly showVolumeDropdown: boolean;
  readonly waveformData: readonly number[];
  readonly isAnalyzing: boolean;
};

type WaveformBarProps = {
  readonly amplitude: number;
  readonly index: number;
  readonly progress: number;
  readonly totalBars: number;
};

type AudioPlayerProps = Record<string, never>;

declare global {
  interface Window {
    __AUDIO_DATA__?: {
      url: string;
      title: string;
    };
  }
}

const calculateOptimalBarCount = (containerWidth: number): number => {
  const barWidthWithGap = 3;
  const containerPadding = 16;
  const availableWidth = containerWidth - containerPadding;
  const calculatedBars = Math.floor(availableWidth / barWidthWithGap);
  return Math.max(80, Math.min(500, calculatedBars));
};

const formatAudioTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const calculateRootMeanSquare = (audioData: Float32Array, start: number, end: number): number => {
  let sum = 0;
  for (let i = start; i < end; i++) {
    sum += audioData[i] * audioData[i];
  }
  return Math.sqrt(sum / (end - start));
};

const generateAudioWaveformData = async (
  audioUrl: string,
  containerWidth: number,
  audioContext: AudioContext | null
): Promise<readonly number[]> => {
  const optimalBars = calculateOptimalBarCount(containerWidth);
  
  const response = await fetch(audioUrl);
  if (!response.ok) {
    throw new Error(`Audio fetch failed: ${response.status}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  const ctx = audioContext || new (window.AudioContext || (window as any).webkitAudioContext)();
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
  
  const channelData = audioBuffer.getChannelData(0);
  const samplesPerBar = Math.floor(channelData.length / optimalBars);
  
  const waveformData: number[] = [];
  
  for (let i = 0; i < optimalBars; i++) {
    const start = i * samplesPerBar;
    const end = Math.min(start + samplesPerBar, channelData.length);
    const rms = calculateRootMeanSquare(channelData, start, end);
    const normalizedAmplitude = Math.max(0.1, Math.min(1, rms * 8));
    waveformData.push(normalizedAmplitude);
  }
  
  return waveformData;
};

const createFallbackWaveformData = (containerWidth: number): readonly number[] => {
  const optimalBars = calculateOptimalBarCount(containerWidth);
  return Array.from({ length: optimalBars }, () => Math.random() * 0.8 + 0.2);
};

const WaveformBar: React.FC<WaveformBarProps> = React.memo(({ amplitude, index, progress, totalBars }) => {
  const barProgress = index / totalBars;
  const isPlayed = barProgress <= progress;
  const barHeight = Math.max(amplitude * 36, 4);
  
  const distanceFromProgress = Math.abs(barProgress - progress);
  const isInTransition = distanceFromProgress < 0.05;
  const transitionDelay = isInTransition ? distanceFromProgress * 200 : 0;
  
  const barStyle = useMemo(() => ({
    height: `${barHeight}px`,
    maxWidth: '2px',
    minWidth: '1px',
    transformOrigin: 'center' as const,
    transform: `scaleY(${isPlayed ? 1.15 : 1}) scaleX(${isInTransition ? 1.2 : 1})`,
    transition: `all 150ms cubic-bezier(0.4, 0, 0.2, 1) ${transitionDelay}ms`,
  }), [barHeight, isPlayed, isInTransition, transitionDelay]);
  
  return (
    <div
      className={`flex-1 bg-secondary ${isPlayed ? 'opacity-100' : 'opacity-40'}`}
      style={barStyle}
    />
  );
});

const AudioButton: React.FC<{
  readonly onClick: () => void;
  readonly className?: string;
  readonly ariaLabel: string;
  readonly children: React.ReactNode;
}> = React.memo(({ onClick, className = '', ariaLabel, children }) => (
  <button
    onClick={onClick}
    className={`bg-main text-secondary border border-main hover:bg-secondary hover:text-main flex items-center justify-center flex-shrink-0 transition-colors ${className}`}
    aria-label={ariaLabel}
  >
    {children}
  </button>
));

export default function AudioPlayer(_props: AudioPlayerProps) {
  const [state, setState] = useState<AudioPlayerState>({
    isVisible: false,
    audioUrl: '/tts/es-ecosistema-uc.wav',
    title: 'Audio del artículo',
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    showVolumeDropdown: false,
    waveformData: [],
    isAnalyzing: false,
  });
  
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const waveformContainerRef = useRef<HTMLDivElement>(null);
  
  const updateState = useCallback((updates: Partial<AudioPlayerState>) => {
    setState(prevState => ({ ...prevState, ...updates }));
  }, []);
  
  const generateWaveform = useCallback(async (audioUrl: string) => {
    try {
      updateState({ isAnalyzing: true });
      
      const container = waveformContainerRef.current;
      const containerWidth = container?.offsetWidth ?? 400;
      
      if (!audioContext) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(ctx);
      }
      
      const waveformData = await generateAudioWaveformData(audioUrl, containerWidth, audioContext);
      updateState({ waveformData, isAnalyzing: false });
      
    } catch (error) {
      console.error('Waveform generation failed:', error);
      const container = waveformContainerRef.current;
      const fallbackData = createFallbackWaveformData(container?.offsetWidth ?? 400);
      updateState({ waveformData: fallbackData, isAnalyzing: false });
    }
  }, [audioContext, updateState]);
  
  const handleTogglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (state.isPlaying) {
        audio.pause();
      } else {
        if (audio.readyState < 2) {
          audio.load();
          await new Promise<void>((resolve) => {
            const handleCanPlay = () => {
              audio.removeEventListener('canplay', handleCanPlay);
              resolve();
            };
            audio.addEventListener('canplay', handleCanPlay);
          });
        }
        await audio.play();
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      updateState({ isPlaying: false });
    }
  }, [state.isPlaying, updateState]);
  
  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    updateState({ volume: newVolume, isMuted: newVolume === 0 });
  }, [updateState]);
  
  const handleToggleMute = useCallback(() => {
    updateState({ isMuted: !state.isMuted });
  }, [state.isMuted, updateState]);
  
  const handleSeek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio?.duration && !isNaN(audio.duration)) {
      const seekTime = Math.max(0, Math.min(time, audio.duration));
      audio.currentTime = seekTime;
      updateState({ currentTime: seekTime });
    }
  }, [updateState]);
  
  const handleWaveformClick = useCallback((e: React.MouseEvent) => {
    if (!state.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = x / rect.width;
    const time = progress * state.duration;
    handleSeek(time);
  }, [state.duration, handleSeek]);
  
  const handleClose = useCallback(() => {
    updateState({ isVisible: false });
    document.dispatchEvent(new CustomEvent('audioPlayerClosed'));
  }, [updateState]);
  
  const handleShowVolumeDropdown = useCallback(() => {
    updateState({ showVolumeDropdown: true });
  }, [updateState]);
  
  const handleHideVolumeDropdown = useCallback(() => {
    updateState({ showVolumeDropdown: false });
  }, [updateState]);
  
  const progress = useMemo(() => 
    state.duration > 0 ? state.currentTime / state.duration : 0,
    [state.currentTime, state.duration]
  );
  
  const playButtonLabel = useMemo(() => 
    state.isPlaying ? `Pause ${state.title}` : `Play ${state.title}`,
    [state.isPlaying, state.title]
  );
  
  const muteButtonLabel = useMemo(() => 
    state.isMuted ? 'Unmute audio' : 'Mute audio',
    [state.isMuted]
  );
  
  const volumePercentage = useMemo(() => 
    Math.round((state.isMuted ? 0 : state.volume) * 100),
    [state.isMuted, state.volume]
  );
  
  const currentTimeFormatted = useMemo(() => formatAudioTime(state.currentTime), [state.currentTime]);
  const durationFormatted = useMemo(() => formatAudioTime(state.duration), [state.duration]);
  
  useEffect(() => {
    const handleShowAudio = () => updateState({ isVisible: true });
    const handleHideAudio = () => updateState({ isVisible: false });
    const handleAudioDataAvailable = (event: CustomEvent) => {
      const { url, title } = event.detail;
      updateState({ audioUrl: url, title });
      if (url) generateWaveform(url);
    };

    if (typeof window !== 'undefined' && window.__AUDIO_DATA__) {
      const { url, title } = window.__AUDIO_DATA__;
      updateState({ audioUrl: url, title });
      if (url) generateWaveform(url);
    }

    document.addEventListener('showAudioPlayer', handleShowAudio);
    document.addEventListener('hideAudioPlayer', handleHideAudio);
    document.addEventListener('audioDataAvailable', handleAudioDataAvailable as EventListener);

    return () => {
      document.removeEventListener('showAudioPlayer', handleShowAudio);
      document.removeEventListener('hideAudioPlayer', handleHideAudio);
      document.removeEventListener('audioDataAvailable', handleAudioDataAvailable as EventListener);
    };
  }, [updateState, generateWaveform]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => updateState({ currentTime: audio.currentTime });
    const handleDurationChange = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        updateState({ duration: audio.duration });
      }
    };
    const handlePlay = () => updateState({ isPlaying: true });
    const handlePause = () => updateState({ isPlaying: false });
    const handleEnded = () => updateState({ isPlaying: false, currentTime: 0 });
    const handleError = () => {
      console.error('Audio error');
      updateState({ isPlaying: false });
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('loadedmetadata', handleDurationChange);
    audio.addEventListener('canplay', handleDurationChange);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    if (state.audioUrl) {
      audio.load();
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('loadedmetadata', handleDurationChange);
      audio.removeEventListener('canplay', handleDurationChange);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [state.audioUrl, updateState]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.isMuted ? 0 : state.volume;
    }
  }, [state.volume, state.isMuted]);

  if (!state.isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 md:bottom-4 md:left-4 md:right-4 z-50 shadow-lg">
      <div className="w-full mx-auto">
        <div className="w-full mx-auto max-w-[var(--max-w-size)] bg-secondary border-2 border-main p-3">
          <audio ref={audioRef} src={state.audioUrl} preload="metadata" />
          
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-main font-mono text-sm font-bold truncate">
                {state.title}
              </h3>
              <div className="text-main font-mono text-xs opacity-70">
                {currentTimeFormatted} / {durationFormatted}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <AudioButton
                onClick={handleTogglePlay}
                className="w-12 h-12"
                ariaLabel={playButtonLabel}
              >
                {state.isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </AudioButton>

              <div className="relative">
                <AudioButton
                  onClick={handleToggleMute}
                  className="w-10 h-10"
                  ariaLabel={muteButtonLabel}
                >
                  <div
                    onMouseEnter={handleShowVolumeDropdown}
                    onMouseLeave={handleHideVolumeDropdown}
                  >
                    {state.isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </div>
                </AudioButton>

                {state.showVolumeDropdown && (
                  <div 
                    className="absolute bottom-full right-0 mb-2 bg-secondary border-2 border-main p-3 shadow-lg z-50"
                    onMouseEnter={handleShowVolumeDropdown}
                    onMouseLeave={handleHideVolumeDropdown}
                  >
                    <div className="flex flex-col items-center gap-2 w-24">
                      <div className="text-main font-mono text-xs opacity-70">
                        {volumePercentage}%
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={state.volume}
                        onChange={handleVolumeChange}
                        className="w-full h-1 bg-main border border-main"
                        aria-label="Volume"
                        style={{
                          writingMode: 'vertical-lr' as const,
                          WebkitAppearance: 'slider-vertical',
                          width: '20px',
                          height: '80px',
                          background: 'var(--color-main)',
                          outline: 'none',
                        } as React.CSSProperties}
                      />
                    </div>
                  </div>
                )}
              </div>

              <AudioButton
                onClick={handleClose}
                className="w-10 h-10"
                ariaLabel="Close audio player"
              >
                <X className="w-5 h-5" />
              </AudioButton>
            </div>
          </div>

          <div 
            ref={waveformContainerRef}
            className="h-16 bg-main border-2 border-main relative overflow-hidden"
          >
            {state.isAnalyzing ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-secondary font-mono text-sm opacity-70">
                  Analyzing audio...
                </div>
              </div>
            ) : state.waveformData.length > 0 ? (
              <div 
                className="flex items-center h-full gap-[0.5px] cursor-pointer px-2 absolute inset-0"
                onClick={handleWaveformClick}
                role="slider"
                aria-label="Audio waveform - Click to seek"
                aria-valuemin={0}
                aria-valuemax={state.duration || 100}
                aria-valuenow={state.currentTime}
                aria-valuetext={`${currentTimeFormatted} of ${durationFormatted}`}
                tabIndex={0}
              >
                {state.waveformData.map((amplitude, index) => (
                  <WaveformBar
                    key={index}
                    amplitude={amplitude}
                    index={index}
                    progress={progress}
                    totalBars={state.waveformData.length}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-secondary font-mono text-sm opacity-70">
                  No audio data
                </div>
              </div>
            )}
            
            {state.waveformData.length > 0 && (
              <div 
                className="absolute top-0 bottom-0 w-1 bg-secondary opacity-90 pointer-events-none"
                style={{
                  left: `${progress * 100}%`,
                  transform: 'translateX(-50%)',
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}