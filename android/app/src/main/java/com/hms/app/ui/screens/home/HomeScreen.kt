package com.hms.app.ui.screens.home

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
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
import com.hms.app.ui.components.GlucoseValueChip
import com.hms.app.ui.components.HmsBottomBar
import com.hms.app.ui.components.HmsButton
import com.hms.app.ui.components.HmsCard
import com.hms.app.ui.theme.TealPrimary
import com.hms.app.util.DateTimeUtils
import com.hms.app.util.GlucoseUnits

@Composable
fun HomeScreen(
    onNavigate: (String) -> Unit,
    viewModel: HomeViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        bottomBar = { HmsBottomBar(currentRoute = "home", onNavigate = onNavigate) }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
                .verticalScroll(rememberScrollState())
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column {
                    val name = uiState.user?.firstName ?: "Patient"
                    Text(
                        text = "Good morning, $name",
                        style = MaterialTheme.typography.titleLarge
                    )
                    Text(
                        text = stringResource(R.string.embu_hospital),
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                }
                IconButton(onClick = { onNavigate("profile") }) {
                    Icon(
                        imageVector = Icons.Default.AccountCircle,
                        contentDescription = "Profile",
                        tint = TealPrimary
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Last Reading Card
            HmsCard {
                Text(
                    text = stringResource(R.string.last_reading),
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
                Spacer(modifier = Modifier.height(8.dp))

                val reading = uiState.lastReading
                if (reading != null) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = "${GlucoseUnits.formatMmol(reading.value)} mmol/L",
                            style = MaterialTheme.typography.displayLarge,
                            color = TealPrimary
                        )
                        uiState.lastReadingRisk?.let { risk ->
                            GlucoseValueChip(level = risk)
                        }
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "${DateTimeUtils.formatDisplayDate(reading.measuredAt)} · ${reading.context.name}",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                } else {
                    Text(
                        text = "No readings logged yet",
                        style = MaterialTheme.typography.bodyLarge
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Large Call to Action: Log Glucose
            HmsButton(
                text = "+ ${stringResource(R.string.log_glucose)}",
                onClick = { onNavigate("log_glucose") }
            )

            Spacer(modifier = Modifier.height(16.dp))

            // HbA1c Summary Card
            HmsCard {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column {
                        Text(
                            text = stringResource(R.string.hba1c_trend),
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                        )
                        val hba1c = uiState.latestHba1c
                        val valStr = if (hba1c != null) "${hba1c.value}%" else "7.4%"
                        Text(
                            text = valStr,
                            style = MaterialTheme.typography.titleLarge
                        )
                    }
                    HmsButton(
                        text = "View Trend",
                        onClick = { onNavigate("hba1c") },
                        modifier = Modifier.fillMaxWidth(0.4f)
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Next Dose Card
            HmsCard {
                Text(
                    text = stringResource(R.string.next_dose),
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
                Spacer(modifier = Modifier.height(4.dp))
                val med = uiState.nextMedication
                val medStr = if (med != null) "${med.name} ${med.dose}" else "Metformin 500mg"
                Text(text = medStr, style = MaterialTheme.typography.bodyLarge)
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Upcoming Appointment Card
            uiState.upcomingAppointment?.let { appt ->
                HmsCard {
                    Text(
                        text = stringResource(R.string.upcoming_appointment),
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Consultation with ${appt.clinicianName ?: "Clinician"}",
                        style = MaterialTheme.typography.bodyLarge
                    )
                    Text(
                        text = DateTimeUtils.formatDisplayDate(appt.startTime),
                        style = MaterialTheme.typography.labelMedium,
                        color = TealPrimary
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    HmsButton(
                        text = "Join Virtual Call",
                        onClick = { onNavigate("pre_call/${appt.id}") }
                    )
                }
            }
        }
    }
}
