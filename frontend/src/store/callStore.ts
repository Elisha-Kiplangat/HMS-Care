import { create } from 'zustand';

interface CallState {
  activeSessionId: string | null;
  callMode: 'VIDEO' | 'AUDIO' | null;
  isInCall: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  networkQuality: 'good' | 'fair' | 'poor';
  startCall: (sessionId: string, mode: 'VIDEO' | 'AUDIO') => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  setNetworkQuality: (quality: 'good' | 'fair' | 'poor') => void;
}

export const useCallStore = create<CallState>((set) => ({
  activeSessionId: null,
  callMode: null,
  isInCall: false,
  isMuted: false,
  isVideoOff: false,
  networkQuality: 'good',
  startCall: (sessionId, mode) =>
    set({ activeSessionId: sessionId, callMode: mode, isInCall: true, isMuted: false, isVideoOff: false }),
  endCall: () => set({ activeSessionId: null, callMode: null, isInCall: false }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  toggleVideo: () => set((state) => ({ isVideoOff: !state.isVideoOff })),
  setNetworkQuality: (quality) => set({ networkQuality: quality }),
}));
