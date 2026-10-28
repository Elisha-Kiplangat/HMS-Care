package com.hms.app.ui.screens.refills

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.FilterChip
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
import com.hms.app.ui.components.ErrorBanner
import com.hms.app.ui.components.HmsButton
import com.hms.app.ui.components.HmsCard
import com.hms.app.ui.components.HmsTextField
import com.hms.app.ui.components.HmsTopBar
import com.hms.app.ui.theme.TealPrimary
import com.hms.app.util.DateTimeUtils

@Composable
fun RefillsScreen(
    onBackClick: () -> Unit,
    viewModel: RefillsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val refills by viewModel.refillsState.collectAsState()
    val medications by viewModel.medicationsState.collectAsState()

    Scaffold(
        topBar = { HmsTopBar(title = "Embu Level 5 Pharmacy Refill", onBackClick = onBackClick) }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
        ) {
            if (uiState.error != null) {
                ErrorBanner(message = uiState.error!!)
                Spacer(modifier = Modifier.height(16.dp))
            }

            Text(text = "Select Medication to Refill", style = MaterialTheme.typography.titleLarge)
            Spacer(modifier = Modifier.height(8.dp))

            Column {
                medications.forEach { med ->
                    FilterChip(
                        selected = uiState.selectedMedicationId == med.id,
                        onClick = { viewModel.selectMedication(med.id) },
                        label = { Text("${med.name} (${med.dose})") },
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth().padding(vertical = 2.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            HmsTextField(
                value = uiState.notes,
                onValueChange = viewModel::onNotesChange,
                label = stringResource(R.string.notes),
                singleLine = false
            )

            Spacer(modifier = Modifier.height(16.dp))

            HmsButton(
                text = if (uiState.isSubmitting) "Submitting..." else stringResource(R.string.request_refill),
                onClick = viewModel::submitRequest,
                enabled = !uiState.isSubmitting
            )

            Spacer(modifier = Modifier.height(24.dp))

            Text(text = "Past Refill Requests", style = MaterialTheme.typography.titleLarge)
            Spacer(modifier = Modifier.height(8.dp))

            LazyColumn {
                items(refills) { item ->
                    HmsCard(modifier = Modifier.padding(vertical = 4.dp)) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = item.medicationName ?: "Medication Refill",
                                    style = MaterialTheme.typography.titleLarge
                                )
                                Text(
                                    text = DateTimeUtils.formatDisplayDate(item.requestedAt),
                                    style = MaterialTheme.typography.labelMedium,
                                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                                )
                            }
                            Text(
                                text = item.status,
                                style = MaterialTheme.typography.labelMedium,
                                color = TealPrimary
                            )
                        }
                    }
                }
            }
        }
    }
}
