package com.hms.app.telemedicine

import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class WebRtcClient @Inject constructor() {
    private var isMuted = false
    private var isVideoEnabled = true

    fun toggleMute(): Boolean {
        isMuted = !isMuted
        return isMuted
    }

    fun toggleVideo(): Boolean {
        isVideoEnabled = !isVideoEnabled
        return isVideoEnabled
    }

    fun close() {
        // Close peer connection
    }
}
