package com.hms.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material.icons.filled.KeyboardDoubleArrowUp
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.hms.app.domain.model.RiskLevel
import com.hms.app.ui.theme.StatusHigh
import com.hms.app.ui.theme.StatusInRange
import com.hms.app.ui.theme.StatusLow

@Composable
fun GlucoseValueChip(
    level: RiskLevel,
    modifier: Modifier = Modifier
) {
    val (bgColor, textColor, icon, label) = when (level) {
        RiskLevel.LOW -> Quad(StatusLow.copy(alpha = 0.15f), StatusLow, Icons.Default.KeyboardArrowDown, "Low")
        RiskLevel.IN_RANGE -> Quad(StatusInRange.copy(alpha = 0.15f), StatusInRange, Icons.Default.Check, "In range")
        RiskLevel.HIGH -> Quad(StatusHigh.copy(alpha = 0.15f), StatusHigh, Icons.Default.KeyboardArrowUp, "High")
        RiskLevel.VERY_HIGH -> Quad(StatusLow.copy(alpha = 0.15f), StatusLow, Icons.Default.KeyboardDoubleArrowUp, "Very high")
    }

    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = modifier
            .background(bgColor, shape = RoundedCornerShape(16.dp))
            .padding(horizontal = 10.dp, vertical = 4.dp)
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            tint = textColor,
            modifier = Modifier.size(16.dp)
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = label,
            color = textColor,
            style = MaterialTheme.typography.labelMedium
        )
    }
}

private data class Quad<A, B, C, D>(val first: A, val second: B, val third: C, val fourth: D)
