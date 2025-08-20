import * as React from 'react';
import AudioPlayer from 'react-audio-player';
import { audioStore, type AudioState } from '../stores/audioStore';

const { useState, useEffect } = React;

export default function PersistentAudioPlayer() {
  const [globalState, setGlobalState] = useState<AudioState>(audioStore.getState());
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  // Subscribe to global audio store
  useEffect(() => {
    const unsubscribe = audioStore.subscribe(setGlobalState);
    console.log('PersistentAudioPlayer: Subscribed to audio store');
    return unsubscribe;
  }, []);

  // Debug current state
  useEffect(() => {
    console.log('PersistentAudioPlayer: Current state', globalState);
  }, [globalState]);

  // Listen for show/hide events from sidebar
  useEffect(() => {
    const handleShowPlayer = () => {
      console.log('PersistentAudioPlayer: Received show event');
      setIsPlayerVisible(true);
    };

    const handleHidePlayer = () => {
      console.log('PersistentAudioPlayer: Received hide event');
      setIsPlayerVisible(false);
    };

    // Listen for custom events
    window.addEventListener('showAudioPlayer', handleShowPlayer);
    window.addEventListener('hideAudioPlayer', handleHidePlayer);

    return () => {
      window.removeEventListener('showAudioPlayer', handleShowPlayer);
      window.removeEventListener('hideAudioPlayer', handleHidePlayer);
    };
  }, []);

  const handlePlay = () => {
    audioStore.updatePlayback(true);
  };

  const handlePause = () => {
    audioStore.updatePlayback(false);
  };

  const handleTimeUpdate = (e: any) => {
    const audio = e.target;
    audioStore.updatePlayback(globalState.isPlaying, audio.currentTime, audio.duration);
  };

  const handleLoadedMetadata = (e: any) => {
    const audio = e.target;
    audioStore.updatePlayback(globalState.isPlaying, globalState.currentTime, audio.duration);
  };

  console.log('PersistentAudioPlayer: Rendering, visible:', isPlayerVisible, 'audioUrl:', globalState.audioUrl);

  return (
    <div 
      id="persistent-audio-player" 
      className={`fixed bottom-0 left-0 right-0 z-50 bg-main border-t-2 border-secondary shadow-[0_-4px_0_var(--color-secondary)] transition-all duration-300 ease-out ${
        isPlayerVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
      style={{ minHeight: '120px' }}
    >
      <div className="p-4">
        {/* Player Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-secondary font-mono text-sm font-bold truncate">
              {globalState.title || 'Audio Player'}
            </h3>
            <div className="text-secondary font-mono text-xs opacity-70">
              Reproduciendo audio narrado
            </div>
          </div>
          
          <button
            onClick={() => {
              const event = new CustomEvent('hideAudioPlayer');
              window.dispatchEvent(event);
            }}
            className="ml-4 w-8 h-8 bg-secondary text-main border-2 border-secondary hover:bg-main hover:text-secondary font-mono text-sm font-bold flex items-center justify-center"
            aria-label="Cerrar reproductor"
          >
            ×
          </button>
        </div>
        
        {/* Audio Player */}
        {globalState.audioUrl && (
          <div className="bg-secondary text-main p-3 border-2 border-secondary">
            <AudioPlayer
              src={globalState.audioUrl}
              controls
              autoPlay={isPlayerVisible}
              onPlay={handlePlay}
              onPause={handlePause}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              style={{
                width: '100%',
                backgroundColor: 'var(--color-secondary)',
                color: 'var(--color-main)',
              }}
              className="w-full"
              preload="metadata"
            />
          </div>
        )}
        
        {/* Debug Info */}
        {!globalState.audioUrl && (
          <div className="bg-red-500 text-white p-2 text-xs font-mono">
            DEBUG: No audio URL. State: {JSON.stringify(globalState)}
            <br />
            Visible: {isPlayerVisible.toString()}
          </div>
        )}
      </div>
    </div>
  );
}