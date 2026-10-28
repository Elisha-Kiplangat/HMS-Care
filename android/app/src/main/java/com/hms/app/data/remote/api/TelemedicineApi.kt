package com.hms.app.data.remote.api

import com.hms.app.data.remote.dto.TurnCredentialsResponseDto
import retrofit2.Response
import retrofit2.http.GET

interface TelemedicineApi {
    @GET("telemedicine/turn-credentials")
    suspend fun getTurnCredentials(): Response<TurnCredentialsResponseDto>
}
