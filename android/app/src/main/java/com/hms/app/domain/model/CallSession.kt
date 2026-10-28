package com.hms.app.domain.model

data class CallSession(
    val id: String,
    val appointmentId: String,
    val modeUsed: String,
    val startedAt: String? = null,
    val endedAt: String? = null
)
