import * as React from 'react';
import CustomAudioPlayer from './CustomAudioPlayer';
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

  const handleClose = () => {
    const event = new CustomEvent('hideAudioPlayer');
    window.dispatchEvent(event);
  };

  console.log('PersistentAudioPlayer: Rendering, visible:', isPlayerVisible, 'audioUrl:', globalState.audioUrl);

  return (
    <div 
      id="persistent-audio-player" 
      className={`fixed bottom-0 left-0 right-0 z-50 shadow-[0_-4px_0_var(--color-secondary)] ${
        isPlayerVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
      style={{ 
        transition: 'transform 300ms ease-out, opacity 300ms ease-out',
        minHeight: '120px'
      }}
    >
      {globalState.audioUrl && globalState.title ? (
        <CustomAudioPlayer
          audioUrl={globalState.audioUrl}
          title={globalState.title}
          onClose={handleClose}
        />
      ) : (
        <div className="bg-main border-t-2 border-secondary p-4">
          <div className="bg-red-500 text-white p-2 text-xs font-mono">
            DEBUG: No audio URL. State: {JSON.stringify(globalState)}
            <br />
            Visible: {isPlayerVisible.toString()}
          </div>
        </div>
      )}
    </div>
  );
}