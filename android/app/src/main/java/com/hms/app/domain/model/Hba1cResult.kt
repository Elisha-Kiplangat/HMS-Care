package com.hms.app.domain.model

data class Hba1cResult(
    val id: String,
    val patientId: String,
    val value: Double,
    val resultDate: String,
    val notes: String? = null,
    val recordedBy: String? = null
)
