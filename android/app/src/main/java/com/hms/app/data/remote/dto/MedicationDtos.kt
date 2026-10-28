package com.hms.app.data.remote.dto

import kotlinx.serialization.Serializable

@Serializable
data class MedicationScheduleDto(
    val id: String = "",
    val timeOfDay: String,
    val daysOfWeek: List<Int> = emptyList()
)

@Serializable
data class MedicationDto(
    val id: String,
    val patientId: String,
    val name: String,
    val dose: String,
    val instructions: String? = null,
    val quantityDispensed: Int = 0,
    val isActive: Boolean = true,
    val schedules: List<MedicationScheduleDto> = emptyList()
)

@Serializable
data class CreateRefillRequestDto(
    val medicationId: String,
    val notes: String? = null
)

@Serializable
data class RefillRequestDto(
    val id: String,
    val patientId: String,
    val medicationId: String,
    val status: String,
    val notes: String? = null,
    val requestedAt: String,
    val fulfilledAt: String? = null,
    val medication: MedicationDto? = null
)
