package com.hms.app.ui.screens.appointments

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.hms.app.R
import com.hms.app.ui.components.EmptyState
import com.hms.app.ui.components.HmsBottomBar
import com.hms.app.ui.components.HmsButton
import com.hms.app.ui.components.HmsCard
import com.hms.app.ui.components.HmsTopBar
import com.hms.app.ui.theme.TealPrimary
import com.hms.app.util.DateTimeUtils

@Composable
fun AppointmentsScreen(
    onNavigate: (String) -> Unit,
    viewModel: AppointmentsViewModel = hiltViewModel()
) {
    val appointments by viewModel.appointmentsState.collectAsState()

    Scaffold(
        topBar = { HmsTopBar(title = stringResource(R.string.nav_visits)) },
        bottomBar = { HmsBottomBar(currentRoute = "appointments", onNavigate = onNavigate) }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
        ) {
            Text(text = "Scheduled Virtual Consultations", style = MaterialTheme.typography.titleLarge)
            Spacer(modifier = Modifier.height(16.dp))

            if (appointments.isEmpty()) {
                EmptyState(title = "No Appointments", subtitle = "Your upcoming virtual visits will appear here.")
            } else {
                LazyColumn {
                    items(appointments) { appt ->
                        HmsCard(modifier = Modifier.padding(vertical = 4.dp)) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = "Dr. ${appt.clinicianName ?: "Clinician"}",
                                        style = MaterialTheme.typography.titleLarge
                                    )
                                    Text(
                                        text = "${DateTimeUtils.formatDisplayDate(appt.startTime)} · ${appt.mode}",
                                        style = MaterialTheme.typography.labelMedium,
                                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                                    )
                                }
                                Text(
                                    text = appt.status,
                                    style = MaterialTheme.typography.labelMedium,
                                    color = TealPrimary
                                )
                            }
                            if (appt.status == "SCHEDULED") {
                                Spacer(modifier = Modifier.height(8.dp))
                                HmsButton(
                                    text = "Join Consultation",
                                    onClick = { onNavigate("pre_call/${appt.id}") }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
