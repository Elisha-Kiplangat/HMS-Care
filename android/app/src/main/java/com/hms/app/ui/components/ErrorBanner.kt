package com.hms.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.hms.app.ui.theme.StatusLow

@Composable
fun ErrorBanner(
    message: String,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .background(StatusLow.copy(alpha = 0.1f), shape = RoundedCornerShape(12.dp))
            .padding(12.dp)
    ) {
        Text(
            text = message,
            color = StatusLow,
            style = MaterialTheme.typography.bodyLarge
        )
    }
}
