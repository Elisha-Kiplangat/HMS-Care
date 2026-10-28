import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VideoRoom } from '../../../components/telemedicine/VideoRoom';
import { AudioOnlyRoom } from '../../../components/telemedicine/AudioOnlyRoom';
import { NetworkQualityBadge } from '../../../components/telemedicine/NetworkQualityBadge';
import { useCallStore } from '../../../store/callStore';
import { useWebRTC } from '../../../hooks/useWebRTC';
import { telemedicineService } from '../../../services/telemedicineService';

export const PatientCall: React.FC = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { callMode, networkQuality, startCall, endCall } = useCallStore();
  const { localStream, remoteStream } = useWebRTC(sessionId, callMode === 'AUDIO' ? 'AUDIO' : 'VIDEO');
  useEffect(() => { if (sessionId) { void telemedicineService.startSession(sessionId); startCall(sessionId, 'VIDEO'); } return () => { endCall(); }; }, [sessionId, startCall, endCall]);

  const handleEndCall = async () => {
    if (sessionId) await telemedicineService.endSession(sessionId);
    endCall();
    navigate('/patient');
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Telemedicine Consultation</h1>
          <p className="text-xs text-text-muted mt-1">Session ID: {sessionId}</p>
        </div>
        <NetworkQualityBadge quality={networkQuality} />
      </div>

      {callMode === 'AUDIO' ? (
        <AudioOnlyRoom onEndCall={handleEndCall} />
      ) : (
        <VideoRoom localStream={localStream} remoteStream={remoteStream} onEndCall={() => void handleEndCall()} />
      )}
    </div>
  );
};
