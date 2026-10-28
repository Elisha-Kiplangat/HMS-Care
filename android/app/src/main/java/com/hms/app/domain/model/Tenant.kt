package com.hms.app.domain.model

data class Tenant(
    val id: String,
    val name: String,
    val slug: String,
    val status: String
)
