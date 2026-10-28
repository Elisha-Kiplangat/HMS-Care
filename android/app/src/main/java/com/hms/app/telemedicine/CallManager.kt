package com.hms.app.telemedicine

import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class CallManager @Inject constructor(
    private val signalingClient: SignalingClient,
    private val webRtcClient: WebRtcClient,
    private val networkQualityMonitor: NetworkQualityMonitor
) {
    fun startCall(appointmentId: String) {
        // Connect signaling & WebRTC
    }

    fun endCall() {
        signalingClient.disconnect()
        webRtcClient.close()
    }

    fun toggleMute(): Boolean = webRtcClient.toggleMute()
    fun toggleVideo(): Boolean = webRtcClient.toggleVideo()
}
