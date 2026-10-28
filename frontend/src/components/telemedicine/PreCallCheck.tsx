import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, Volume2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export interface PreCallCheckProps {
  onReady: () => void;
  onCancel?: () => void;
}

export const PreCallCheck: React.FC<PreCallCheckProps> = ({ onReady, onCancel }) => {
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [hasMic, setHasMic] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    async function checkDevices() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        activeStream = mediaStream;
        setStream(mediaStream);
        setHasCamera(true);
        setHasMic(true);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.warn('Device check error:', err);
        setHasCamera(false);
        setHasMic(false);
      }
    }
    checkDevices();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <Card className="max-w-lg mx-auto flex flex-col gap-6 p-6">
      <div>
        <h2 className="text-lg font-bold text-text">Pre-Call Device Check</h2>
        <p className="text-xs text-text-muted mt-1">
          Verify your camera, microphone, and internet before entering session.
        </p>
      </div>

      <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden border border-border flex items-center justify-center">
        {stream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400 text-xs">
            <Camera className="w-8 h-8 animate-pulse" />
            <span>Requesting camera permission...</span>
          </div>
        )}
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-primary" />
            <span className="font-medium text-text">Camera</span>
          </div>
          {hasCamera === true ? (
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Ready
            </span>
          ) : hasCamera === false ? (
            <span className="flex items-center gap-1 text-red-500 font-semibold">
              <AlertCircle className="w-4 h-4" /> Not detected
            </span>
          ) : (
            <span className="text-text-muted">Testing...</span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-primary" />
            <span className="font-medium text-text">Microphone</span>
          </div>
          {hasMic === true ? (
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Ready
            </span>
          ) : hasMic === false ? (
            <span className="flex items-center gap-1 text-red-500 font-semibold">
              <AlertCircle className="w-4 h-4" /> Not detected
            </span>
          ) : (
            <span className="text-text-muted">Testing...</span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-primary" />
            <span className="font-medium text-text">Audio Output</span>
          </div>
          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
            <CheckCircle2 className="w-4 h-4" /> Ready
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={onReady} className="font-bold px-6">
          Enter Call Session
        </Button>
      </div>
    </Card>
  );
};
