// Global audio store for persistent audio player
interface AudioState {
  audioUrl: string | null;
  title: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  waveformData: number[] | null;
  isMuted: boolean;
  volumeBeforeMute: number;
}

class AudioStore {
  private state: AudioState = {
    audioUrl: null,
    title: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackRate: 1,
    waveformData: null,
    isMuted: false,
    volumeBeforeMute: 1,
  };

  private listeners: Set<(state: AudioState) => void> = new Set();
  private audioElement: HTMLAudioElement | null = null;

  // Subscribe to state changes
  subscribe(listener: (state: AudioState) => void): () => void {
    this.listeners.add(listener);
    
    // Unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Notify all listeners
  private notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Get current state
  getState(): AudioState {
    return { ...this.state };
  }

  // Set audio track
  setTrack(audioUrl: string, title: string) {
    console.log('AudioStore: setTrack called with', { audioUrl, title });
    // Only update if different track
    if (this.state.audioUrl !== audioUrl) {
      this.state = {
        ...this.state,
        audioUrl,
        title,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        waveformData: null,
      };
      console.log('AudioStore: Track updated, new state:', this.state);
      this.notify();
      console.log('AudioStore: Notified', this.listeners.size, 'listeners');
    } else {
      console.log('AudioStore: Same track, not updating');
    }
  }

  // Update playback state
  updatePlayback(isPlaying: boolean, currentTime?: number, duration?: number) {
    this.state = {
      ...this.state,
      isPlaying,
      ...(currentTime !== undefined && { currentTime }),
      ...(duration !== undefined && { duration }),
    };
    this.notify();
  }

  // Set audio element reference
  setAudioElement(audio: HTMLAudioElement | null) {
    this.audioElement = audio;
  }

  // Get audio element
  getAudioElement(): HTMLAudioElement | null {
    return this.audioElement;
  }

  // Set volume
  setVolume(volume: number) {
    const newVolume = Math.max(0, Math.min(1, volume));
    this.state = {
      ...this.state,
      volume: newVolume,
      isMuted: newVolume === 0,
    };
    this.notify();
  }

  // Toggle mute
  toggleMute() {
    if (this.state.isMuted) {
      // Unmute: restore previous volume
      this.state = {
        ...this.state,
        volume: this.state.volumeBeforeMute,
        isMuted: false,
      };
    } else {
      // Mute: save current volume and set to 0
      this.state = {
        ...this.state,
        volumeBeforeMute: this.state.volume,
        volume: 0,
        isMuted: true,
      };
    }
    this.notify();
  }

  // Set playback rate
  setPlaybackRate(rate: number) {
    this.state = {
      ...this.state,
      playbackRate: rate,
    };
    this.notify();
  }

  // Set waveform data
  setWaveformData(waveformData: number[]) {
    this.state = {
      ...this.state,
      waveformData,
    };
    this.notify();
  }

  // Seek to specific time
  seekTo(time: number) {
    if (this.audioElement) {
      this.audioElement.currentTime = time;
    }
    this.state = {
      ...this.state,
      currentTime: time,
    };
    this.notify();
  }

  // Clear current track
  clearTrack() {
    this.state = {
      audioUrl: null,
      title: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 1,
      playbackRate: 1,
      waveformData: null,
      isMuted: false,
      volumeBeforeMute: 1,
    };
    this.notify();
  }
}

// Export singleton instance
export const audioStore = new AudioStore();

// Types for external use
export type { AudioState };