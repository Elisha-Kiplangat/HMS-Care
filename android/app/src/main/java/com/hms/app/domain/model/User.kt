package com.hms.app.domain.model

data class User(
    val id: String,
    val email: String,
    val firstName: String,
    val lastName: String,
    val role: String,
    val tenantId: String? = null,
    val tenantName: String? = null
)
