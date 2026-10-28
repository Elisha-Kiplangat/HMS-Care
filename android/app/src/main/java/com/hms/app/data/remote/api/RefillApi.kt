package com.hms.app.data.remote.api

import com.hms.app.data.remote.dto.CreateRefillRequestDto
import com.hms.app.data.remote.dto.RefillRequestDto
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface RefillApi {
    @POST("refills")
    suspend fun requestRefill(@Body request: CreateRefillRequestDto): Response<RefillRequestDto>

    @GET("refills")
    suspend fun getRefills(): Response<List<RefillRequestDto>>
}
