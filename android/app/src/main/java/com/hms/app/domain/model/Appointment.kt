package com.hms.app.domain.model

data class Appointment(
    val id: String,
    val patientId: String,
    val clinicianId: String,
    val clinicianName: String? = null,
    val startTime: String,
    val endTime: String,
    val mode: String,
    val status: String,
    val reason: String? = null
)
