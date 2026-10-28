package com.hms.app.ui.screens.call

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.hms.app.ui.components.HmsButton
import com.hms.app.ui.theme.TealPrimary

@Composable
fun VideoCallScreen(
    appointmentId: String,
    onEndCall: () -> Unit,
    viewModel: CallViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(appointmentId) {
        viewModel.startCall(appointmentId)
    }

    Scaffold { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(Color.Black)
        ) {
            // Video stream surface container
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center,
                modifier = Modifier.fillMaxSize()
            ) {
                Text(
                    text = "Video Consultation",
                    style = MaterialTheme.typography.titleLarge,
                    color = Color.White
                )
                Text(
                    text = "Connected with Clinician",
                    style = MaterialTheme.typography.bodyLarge,
                    color = Color.LightGray
                )
            }

            // In-call control bar
            Column(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .fillMaxWidth()
                    .padding(24.dp)
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    HmsButton(
                        text = if (uiState.isMuted) "Unmute" else "Mute",
                        onClick = viewModel::toggleMute,
                        modifier = Modifier.weight(1f)
                    )
                    HmsButton(
                        text = if (uiState.isVideoEnabled) "Cam Off" else "Cam On",
                        onClick = viewModel::toggleVideo,
                        modifier = Modifier.weight(1f)
                    )
                }
                Spacer(modifier = Modifier.height(12.dp))
                HmsButton(
                    text = "End Call",
                    onClick = {
                        viewModel.endCall()
                        onEndCall()
                    }
                )
            }
        }
    }
}
