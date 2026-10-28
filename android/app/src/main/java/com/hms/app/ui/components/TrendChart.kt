package com.hms.app.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.dp
import com.hms.app.ui.theme.TealPrimary

@Composable
fun TrendChart(
    values: List<Double>,
    modifier: Modifier = Modifier
) {
    if (values.size < 2) return

    val minVal = values.minOrNull() ?: 0.0
    val maxVal = values.maxOrNull() ?: 1.0
    val range = if (maxVal - minVal == 0.0) 1.0 else maxVal - minVal

    Canvas(
        modifier = modifier
            .fillMaxWidth()
            .height(120.dp)
    ) {
        val width = size.width
        val height = size.height
        val stepX = width / (values.size - 1)

        val path = Path()
        values.forEachIndexed { index, valPoint ->
            val x = index * stepX
            val normalizedY = (valPoint - minVal) / range
            val y = height - (normalizedY * height * 0.8f + height * 0.1f).toFloat()

            if (index == 0) {
                path.moveTo(x, y)
            } else {
                path.lineTo(x, y)
            }

            drawCircle(
                color = TealPrimary,
                radius = 6.dp.toPx(),
                center = Offset(x, y)
            )
        }

        drawPath(
            path = path,
            color = TealPrimary,
            style = Stroke(width = 3.dp.toPx())
        )
    }
}
