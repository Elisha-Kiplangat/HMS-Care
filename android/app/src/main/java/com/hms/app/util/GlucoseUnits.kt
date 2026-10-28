package com.hms.app.util

object GlucoseUnits {
    private const val CONVERSION_FACTOR = 18.016

    fun mmolToMgDl(mmol: Double): Double {
        return mmol * CONVERSION_FACTOR
    }

    fun mgDlToMmol(mgDl: Double): Double {
        return mgDl / CONVERSION_FACTOR
    }

    fun formatMmol(mmol: Double): String {
        return String.format("%.1f", mmol)
    }

    fun formatMgDl(mmol: Double): String {
        return String.format("%.0f", mmolToMgDl(mmol))
    }
}
