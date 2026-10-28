package com.hms.app.ui.screens.call

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
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
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.hms.app.ui.components.HmsButton
import com.hms.app.ui.theme.TealPrimary

@Composable
fun AudioCallScreen(
    appointmentId: String,
    onEndCall: () -> Unit,
    viewModel: CallViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(appointmentId) {
        viewModel.startCall(appointmentId)
    }

    Scaffold { padding ->
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(24.dp)
        ) {
            Text(
                text = "Audio Consultation (Opus)",
                style = MaterialTheme.typography.titleLarge,
                color = TealPrimary
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Low Bandwidth Mode Connected",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
            )

            Spacer(modifier = Modifier.height(48.dp))

            HmsButton(
                text = if (uiState.isMuted) "Unmute" else "Mute",
                onClick = viewModel::toggleMute
            )

            Spacer(modifier = Modifier.height(16.dp))

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
