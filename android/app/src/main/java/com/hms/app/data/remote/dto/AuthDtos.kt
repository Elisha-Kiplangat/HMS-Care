package com.hms.app.data.remote.dto

import kotlinx.serialization.Serializable

@Serializable
data class LoginRequestDto(
    val email: String,
    val password: String
)

@Serializable
data class RefreshTokenRequestDto(
    val refreshToken: String
)

@Serializable
data class AcceptInvitationRequestDto(
    val token: String,
    val password: String,
    val firstName: String,
    val lastName: String
)

@Serializable
data class UserDto(
    val id: String,
    val email: String,
    val firstName: String,
    val lastName: String,
    val role: String,
    val tenantId: String? = null,
    val tenantName: String? = null
)

@Serializable
data class LoginResponseDto(
    val accessToken: String,
    val refreshToken: String,
    val user: UserDto
)

@Serializable
data class TokenRefreshResponseDto(
    val accessToken: String,
    val refreshToken: String
)

@Serializable
data class MessageResponseDto(
    val message: String
)
