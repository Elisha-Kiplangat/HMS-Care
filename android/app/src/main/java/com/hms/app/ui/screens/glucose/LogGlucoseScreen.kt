package com.hms.app.ui.screens.glucose

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.hms.app.R
import com.hms.app.domain.model.GlucoseContext
import com.hms.app.ui.components.ErrorBanner
import com.hms.app.ui.components.GlucoseValueChip
import com.hms.app.ui.components.HmsBottomBar
import com.hms.app.ui.components.HmsButton
import com.hms.app.ui.components.HmsTextField
import com.hms.app.ui.components.HmsTopBar

@Composable
fun LogGlucoseScreen(
    onNavigate: (String) -> Unit,
    onSuccess: () -> Unit,
    viewModel: GlucoseViewModel = hiltViewModel()
) {
    val uiState by viewModel.logUiState.collectAsState()

    LaunchedEffect(uiState.isSaved) {
        if (uiState.isSaved) {
            onSuccess()
        }
    }

    Scaffold(
        topBar = { HmsTopBar(title = stringResource(R.string.log_glucose)) },
        bottomBar = { HmsBottomBar(currentRoute = "log_glucose", onNavigate = onNavigate) }
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

            // Glucose input with large keypad
            HmsTextField(
                value = uiState.valueInput,
                onValueChange = viewModel::onValueInput,
                label = stringResource(R.string.enter_glucose),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
            )

            Spacer(modifier = Modifier.height(12.dp))

            uiState.classifiedRisk?.let { risk ->
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(text = "Status: ", style = MaterialTheme.typography.bodyLarge)
                    GlucoseValueChip(level = risk)
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Context Selector
            Text(text = stringResource(R.string.context), style = MaterialTheme.typography.titleLarge)
            Spacer(modifier = Modifier.height(8.dp))

            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                GlucoseContext.entries.take(3).forEach { ctx ->
                    FilterChip(
                        selected = uiState.context == ctx,
                        onClick = { viewModel.onContextChange(ctx) },
                        label = { Text(ctx.name.replace("_", " ")) },
                        shape = RoundedCornerShape(16.dp)
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

            Spacer(modifier = Modifier.weight(1f))

            Text(
                text = stringResource(R.string.offline_sync_notice),
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f),
                modifier = Modifier.align(Alignment.CenterHorizontally)
            )
            Spacer(modifier = Modifier.height(8.dp))

            HmsButton(
                text = if (uiState.isSaving) "Saving..." else stringResource(R.string.save),
                onClick = viewModel::logReading,
                enabled = !uiState.isSaving
            )
        }
    }
}
