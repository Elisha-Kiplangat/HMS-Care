package com.hms.app.telemedicine

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import javax.inject.Inject
import javax.inject.Singleton

enum class NetworkQuality {
    EXCELLENT,
    GOOD,
    POOR_AUDIO_ONLY
}

@Singleton
class NetworkQualityMonitor @Inject constructor() {
    private val _quality = MutableStateFlow(NetworkQuality.GOOD)
    val quality: StateFlow<NetworkQuality> = _quality

    fun updateBandwidth(kbps: Int) {
        _quality.value = when {
            kbps < 150 -> NetworkQuality.POOR_AUDIO_ONLY
            kbps < 500 -> NetworkQuality.GOOD
            else -> NetworkQuality.EXCELLENT
        }
    }
}
