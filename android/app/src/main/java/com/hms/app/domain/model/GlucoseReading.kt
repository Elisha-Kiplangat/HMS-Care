package com.hms.app.domain.model

enum class GlucoseContext {
    FASTING,
    BEFORE_MEAL,
    AFTER_MEAL,
    BEDTIME,
    RANDOM
}

data class GlucoseReading(
    val id: String,
    val patientId: String,
    val value: Double,
    val context: GlucoseContext = GlucoseContext.RANDOM,
    val notes: String? = null,
    val source: String = "MANUAL",
    val measuredAt: String,
    val isSynced: Boolean = true
)
