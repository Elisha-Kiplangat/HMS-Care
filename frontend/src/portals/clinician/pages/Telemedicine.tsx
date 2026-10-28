import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { VideoRoom } from '../../../components/telemedicine/VideoRoom';
import { InCallVitalsPanel } from '../../../components/telemedicine/InCallVitalsPanel';
import { useCallStore } from '../../../store/callStore';
import { useWebRTC } from '../../../hooks/useWebRTC';
import { telemedicineService } from '../../../services/telemedicineService';

export const ClinicianTelemedicine: React.FC = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { callMode, startCall, endCall } = useCallStore();
  const { localStream, remoteStream } = useWebRTC(sessionId, callMode === 'AUDIO' ? 'AUDIO' : 'VIDEO');
  useEffect(() => { if (sessionId) { void telemedicineService.startSession(sessionId); startCall(sessionId, 'VIDEO'); } return () => { endCall(); }; }, [sessionId, startCall, endCall]);
  const handleEndCall = async () => { if (sessionId) await telemedicineService.endSession(sessionId); endCall(); navigate('/clinician/schedule'); };
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <VideoRoom localStream={localStream} remoteStream={remoteStream} onEndCall={() => void handleEndCall()} />
      </div>
      <div>
        <InCallVitalsPanel />
      </div>
    </div>
  );
};
