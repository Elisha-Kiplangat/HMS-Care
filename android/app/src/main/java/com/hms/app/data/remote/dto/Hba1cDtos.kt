package com.hms.app.data.remote.dto

import kotlinx.serialization.Serializable

@Serializable
data class Hba1cResultDto(
    val id: String,
    val patientId: String,
    val value: Double,
    val resultDate: String,
    val notes: String? = null,
    val recordedById: String? = null
)
