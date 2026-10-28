package com.hms.app.ui.screens.medications

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

@Composable
fun MedicationsScreen(
    onNavigate: (String) -> Unit,
    viewModel: MedicationsViewModel = hiltViewModel()
) {
    val medications by viewModel.medicationsState.collectAsState()

    Scaffold(
        topBar = { HmsTopBar(title = stringResource(R.string.nav_meds)) },
        bottomBar = { HmsBottomBar(currentRoute = "medications", onNavigate = onNavigate) }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = "Active Medications",
                    style = MaterialTheme.typography.titleLarge,
                    modifier = Modifier.weight(1f)
                )
                HmsButton(
                    text = stringResource(R.string.request_refill),
                    onClick = { onNavigate("refills") },
                    modifier = Modifier.fillMaxWidth(0.45f)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            if (medications.isEmpty()) {
                EmptyState(title = "No Medications", subtitle = "Your prescribed medications will appear here.")
            } else {
                LazyColumn {
                    items(medications) { med ->
                        HmsCard(modifier = Modifier.padding(vertical = 4.dp)) {
                            Text(text = "${med.name} ${med.dose}", style = MaterialTheme.typography.titleLarge)
                            if (!med.instructions.isNull_or_empty()) {
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = med.instructions!!,
                                    style = MaterialTheme.typography.bodyLarge,
                                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                                )
                            }
                            if (med.schedules.isNotEmpty()) {
                                Spacer(modifier = Modifier.height(4.dp))
                                val times = med.schedules.joinToString(", ") { it.timeOfDay }
                                Text(
                                    text = "Dose times: $times",
                                    style = MaterialTheme.typography.labelMedium,
                                    color = MaterialTheme.colorScheme.primary
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

private fun String?.isNull_or_empty(): Boolean = this == null || this.isEmpty()
