package com.hms.app.domain.model

data class MedicationSchedule(
    val id: String = "",
    val timeOfDay: String,
    val daysOfWeek: List<Int> = emptyList()
)

data class Medication(
    val id: String,
    val patientId: String,
    val name: String,
    val dose: String,
    val instructions: String? = null,
    val quantityDispensed: Int = 0,
    val isActive: Boolean = true,
    val schedules: List<MedicationSchedule> = emptyList()
)
