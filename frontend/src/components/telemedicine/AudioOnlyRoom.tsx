import React from 'react';
import { Mic, PhoneOff } from 'lucide-react';
import { Button } from '../ui/Button';

export interface AudioOnlyRoomProps {
  onEndCall: () => void;
}

export const AudioOnlyRoom: React.FC<AudioOnlyRoomProps> = ({ onEndCall }) => {
  return (
    <div className="w-full h-80 bg-slate-900 rounded-card flex flex-col items-center justify-center gap-6 p-6">
      <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary animate-pulse">
        <Mic className="w-10 h-10" />
      </div>
      <div className="text-center text-white">
        <h4 className="text-lg font-bold">Audio Consultation Active</h4>
        <p className="text-xs text-slate-400 mt-1">Low-bandwidth mode active for clear voice quality.</p>
      </div>
      <Button variant="danger" size="md" onClick={onEndCall} className="rounded-full px-6">
        <PhoneOff className="w-5 h-5 mr-2" /> End Call
      </Button>
    </div>
  );
};
