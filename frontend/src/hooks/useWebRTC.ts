import { useEffect, useRef, useState } from 'react';
import { useSocket } from './useSocket';

export const useWebRTC = (sessionId?: string, callMode: 'VIDEO' | 'AUDIO' = 'VIDEO') => {
  const socket = useSocket('/signaling');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (!sessionId || !socket) return;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    peerConnection.current = pc;

    const handleUserJoined = async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('offer', { roomId: sessionId, offer });
    };
    const handleOffer = async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', { roomId: sessionId, answer });
    };
    const handleAnswer = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
      if (!pc.currentRemoteDescription) await pc.setRemoteDescription(new RTCSessionDescription(answer));
    };
    const handleIceCandidate = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      if (candidate) await pc.addIceCandidate(new RTCIceCandidate(candidate));
    };
    const handleIce = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) socket.emit('ice-candidate', { roomId: sessionId, candidate: event.candidate });
    };
    pc.onicecandidate = handleIce;
    socket.emit('join-room', { roomId: sessionId });
    socket.on('user-joined', handleUserJoined);
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);

    if (navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ video: callMode === 'VIDEO', audio: true })
        .then((stream) => {
          setLocalStream(stream);
          stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        })
        .catch((err) => console.error('Media stream error:', err));
    }

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    return () => {
      socket.off('user-joined', handleUserJoined);
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleIceCandidate);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      pc.close();
    };
  }, [sessionId, callMode, socket]);

  const streamRef = useRef<MediaStream | null>(null);
  useEffect(() => { streamRef.current = localStream; }, [localStream]);

  return { localStream, remoteStream, peerConnection: peerConnection.current, socket };
};
