package com.hms.app.data.remote.dto

import kotlinx.serialization.Serializable

@Serializable
data class ClinicianUserDto(
    val firstName: String? = null,
    val lastName: String? = null
)

@Serializable
data class ClinicianInfoDto(
    val id: String,
    val user: ClinicianUserDto? = null
)

@Serializable
data class AppointmentDto(
    val id: String,
    val patientId: String,
    val clinicianId: String,
    val startTime: String,
    val endTime: String,
    val mode: String,
    val status: String,
    val reason: String? = null,
    val clinician: ClinicianInfoDto? = null
)
