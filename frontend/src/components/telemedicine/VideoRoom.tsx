import React, { useEffect, useRef } from 'react';
import { PhoneOff } from 'lucide-react';
import { Button } from '../ui/Button';

export interface VideoRoomProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  onEndCall: () => void;
}

export const VideoRoom: React.FC<VideoRoomProps> = ({ localStream, remoteStream, onEndCall }) => {
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  return (
    <div className="relative w-full h-[450px] bg-slate-900 rounded-card overflow-hidden flex items-center justify-center">
      {remoteStream ? (
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="text-white text-center">
          <p className="text-lg font-semibold">Waiting for other participant...</p>
        </div>
      )}

      {localStream && (
        <div className="absolute top-4 right-4 w-36 h-28 bg-slate-800 border-2 border-white/20 rounded-lg overflow-hidden shadow-lg">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="absolute bottom-6 flex items-center gap-4 bg-slate-800/80 backdrop-blur px-6 py-3 rounded-full border border-white/10">
        <Button variant="danger" size="md" onClick={onEndCall} className="rounded-full px-5">
          <PhoneOff className="w-5 h-5 mr-2" /> End Call
        </Button>
      </div>
    </div>
  );
};
