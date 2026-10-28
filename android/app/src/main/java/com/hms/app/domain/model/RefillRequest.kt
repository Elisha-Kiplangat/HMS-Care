package com.hms.app.domain.model

data class RefillRequest(
    val id: String,
    val patientId: String,
    val medicationId: String,
    val medicationName: String? = null,
    val status: String,
    val notes: String? = null,
    val requestedAt: String,
    val fulfilledAt: String? = null
)
