package com.hms.app.data.remote.dto

import kotlinx.serialization.Serializable

@Serializable
data class IceServerDto(
    val urls: List<String> = emptyList(),
    val username: String? = null,
    val credential: String? = null
)

@Serializable
data class TurnCredentialsResponseDto(
    val iceServers: List<IceServerDto> = emptyList()
)
