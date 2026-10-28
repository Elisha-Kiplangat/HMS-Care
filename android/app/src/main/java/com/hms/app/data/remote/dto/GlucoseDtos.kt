package com.hms.app.data.remote.dto

import kotlinx.serialization.Serializable

@Serializable
data class CreateGlucoseReadingDto(
    val value: Double,
    val context: String = "RANDOM",
    val notes: String? = null,
    val source: String = "MANUAL",
    val measuredAt: String? = null
)

@Serializable
data class GlucoseReadingDto(
    val id: String,
    val patientId: String,
    val value: Double,
    val context: String,
    val notes: String? = null,
    val source: String = "MANUAL",
    val measuredAt: String,
    val createdAt: String? = null
)
