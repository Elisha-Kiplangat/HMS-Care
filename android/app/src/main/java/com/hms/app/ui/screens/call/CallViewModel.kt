package com.hms.app.ui.screens.call

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.hms.app.telemedicine.CallManager
import com.hms.app.telemedicine.NetworkQuality
import com.hms.app.telemedicine.NetworkQualityMonitor
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class CallUiState(
    val isMuted: Boolean = false,
    val isVideoEnabled: Boolean = true,
    val networkQuality: NetworkQuality = NetworkQuality.GOOD,
    val isConnected: Boolean = false
)

@HiltViewModel
class CallViewModel @Inject constructor(
    private val callManager: CallManager,
    private val networkQualityMonitor: NetworkQualityMonitor
) : ViewModel() {

    private val _uiState = MutableStateFlow(CallUiState())
    val uiState: StateFlow<CallUiState> = _uiState

    init {
        viewModelScope.launch {
            networkQualityMonitor.quality.collect { q ->
                _uiState.value = _uiState.value.copy(networkQuality = q)
            }
        }
    }

    fun startCall(appointmentId: String) {
        callManager.startCall(appointmentId)
        _uiState.value = _uiState.value.copy(isConnected = true)
    }

    fun toggleMute() {
        val muted = callManager.toggleMute()
        _uiState.value = _uiState.value.copy(isMuted = muted)
    }

    fun toggleVideo() {
        val video = callManager.toggleVideo()
        _uiState.value = _uiState.value.copy(isVideoEnabled = video)
    }

    fun endCall() {
        callManager.endCall()
        _uiState.value = _uiState.value.copy(isConnected = false)
    }
}
