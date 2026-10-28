package com.hms.app.ui.screens.glucose

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
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.hms.app.domain.usecase.ClassifyReading
import com.hms.app.ui.components.EmptyState
import com.hms.app.ui.components.GlucoseValueChip
import com.hms.app.ui.components.HmsCard
import com.hms.app.ui.components.HmsTopBar
import com.hms.app.ui.components.InRangeBar
import com.hms.app.ui.theme.TealPrimary
import com.hms.app.util.DateTimeUtils
import com.hms.app.util.GlucoseUnits

@Composable
fun GlucoseHistoryScreen(
    onBackClick: () -> Unit,
    viewModel: GlucoseViewModel = hiltViewModel()
) {
    val readings by viewModel.historyState.collectAsState()
    val classifyReading = ClassifyReading()

    Scaffold(
        topBar = { HmsTopBar(title = "Glucose History", onBackClick = onBackClick) }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
        ) {
            InRangeBar(percentage = 78)
            Spacer(modifier = Modifier.height(16.dp))

            if (readings.isEmpty()) {
                EmptyState(title = "No Readings Yet", subtitle = "Your logged glucose readings will appear here.")
            } else {
                LazyColumn {
                    items(readings) { item ->
                        HmsCard(modifier = Modifier.padding(vertical = 4.dp)) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = "${GlucoseUnits.formatMmol(item.value)} mmol/L",
                                        style = MaterialTheme.typography.titleLarge,
                                        color = TealPrimary
                                    )
                                    Text(
                                        text = "${DateTimeUtils.formatDisplayDate(item.measuredAt)} · ${item.context.name}",
                                        style = MaterialTheme.typography.labelMedium,
                                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                                    )
                                }
                                GlucoseValueChip(level = classifyReading(item.value))
                            }
                        }
                    }
                }
            }
        }
    }
}
