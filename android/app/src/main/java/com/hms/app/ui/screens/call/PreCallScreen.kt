package com.hms.app.ui.screens.call

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.hms.app.telemedicine.NetworkQuality
import com.hms.app.ui.components.HmsButton
import com.hms.app.ui.components.HmsCard
import com.hms.app.ui.components.HmsTopBar

@Composable
fun PreCallScreen(
    appointmentId: String,
    onStartVideoCall: () -> Unit,
    onStartAudioCall: () -> Unit,
    onBackClick: () -> Unit,
    viewModel: CallViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = { HmsTopBar(title = "Pre-Call Setup", onBackClick = onBackClick) }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
        ) {
            HmsCard {
                Text(text = "Connection Check", style = MaterialTheme.typography.titleLarge)
                Spacer(modifier = Modifier.height(8.dp))
                val qualityText = when (uiState.networkQuality) {
                    NetworkQuality.EXCELLENT -> "Network: Excellent"
                    NetworkQuality.GOOD -> "Network: Good"
                    NetworkQuality.POOR_AUDIO_ONLY -> "Network: Weak - Switching to Audio-Only Mode"
                }
                Text(text = qualityText, style = MaterialTheme.typography.bodyLarge)
            }

            Spacer(modifier = Modifier.height(24.dp))

            HmsButton(
                text = "Join Video Call",
                onClick = onStartVideoCall,
                enabled = uiState.networkQuality != NetworkQuality.POOR_AUDIO_ONLY
            )

            Spacer(modifier = Modifier.height(16.dp))

            HmsButton(
                text = "Join Audio-Only Call (Low Bandwidth)",
                onClick = onStartAudioCall
            )
        }
    }
}
