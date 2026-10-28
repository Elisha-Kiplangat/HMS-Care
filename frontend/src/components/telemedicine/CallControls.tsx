import React from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, Settings } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { cn } from '../../utils/cn';

export interface CallControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing?: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare?: () => void;
  onOpenSettings?: () => void;
  onEndCall: () => void;
  className?: string;
}

export const CallControls: React.FC<CallControlsProps> = ({
  isMuted,
  isVideoOff,
  isScreenSharing,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onOpenSettings,
  onEndCall,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-800 text-white',
        className
      )}
    >
      <IconButton
        ariaLabel={isMuted ? 'Unmute microphone' : 'Mute microphone'}
        variant={isMuted ? 'danger' : 'secondary'}
        size="lg"
        onClick={onToggleMute}
        className="rounded-full"
      >
        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </IconButton>

      <IconButton
        ariaLabel={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
        variant={isVideoOff ? 'danger' : 'secondary'}
        size="lg"
        onClick={onToggleVideo}
        className="rounded-full"
      >
        {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
      </IconButton>

      {onToggleScreenShare && (
        <IconButton
          ariaLabel="Share screen"
          variant={isScreenSharing ? 'primary' : 'secondary'}
          size="lg"
          onClick={onToggleScreenShare}
          className="rounded-full"
        >
          <Monitor className="w-5 h-5" />
        </IconButton>
      )}

      {onOpenSettings && (
        <IconButton
          ariaLabel="Call settings"
          variant="secondary"
          size="lg"
          onClick={onOpenSettings}
          className="rounded-full"
        >
          <Settings className="w-5 h-5" />
        </IconButton>
      )}

      <IconButton
        ariaLabel="End call"
        variant="danger"
        size="lg"
        onClick={onEndCall}
        className="rounded-full bg-red-600 hover:bg-red-700 text-white px-5"
      >
        <PhoneOff className="w-5 h-5" />
      </IconButton>
    </div>
  );
};
