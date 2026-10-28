package com.hms.app.ui.screens.hba1c

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
import com.hms.app.ui.components.HmsCard
import com.hms.app.ui.components.HmsTopBar
import com.hms.app.ui.components.TrendChart
import com.hms.app.ui.theme.TealPrimary
import com.hms.app.util.DateTimeUtils

@Composable
fun Hba1cScreen(
    onBackClick: () -> Unit,
    viewModel: Hba1cViewModel = hiltViewModel()
) {
    val results by viewModel.hba1cState.collectAsState()

    Scaffold(
        topBar = { HmsTopBar(title = stringResource(R.string.hba1c_trend), onBackClick = onBackClick) }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
        ) {
            val chartValues = if (results.isNotEmpty()) results.map { it.value } else listOf(7.8, 7.5, 7.2)
            HmsCard {
                Text(text = "HbA1c Trend Over Time", style = MaterialTheme.typography.titleLarge)
                Spacer(modifier = Modifier.height(12.dp))
                TrendChart(values = chartValues)
            }

            Spacer(modifier = Modifier.height(16.dp))

            HmsCard {
                Text(
                    text = "Understanding your HbA1c",
                    style = MaterialTheme.typography.titleLarge
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "HbA1c reflects your average blood sugar level over the past 3 months. A lower value indicates improved long-term glycemic control.",
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.8f)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            LazyColumn {
                items(results) { item ->
                    HmsCard(modifier = Modifier.padding(vertical = 4.dp)) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column {
                                Text(
                                    text = "${item.value}%",
                                    style = MaterialTheme.typography.titleLarge,
                                    color = TealPrimary
                                )
                                Text(
                                    text = DateTimeUtils.formatDisplayDate(item.resultDate),
                                    style = MaterialTheme.typography.labelMedium,
                                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
