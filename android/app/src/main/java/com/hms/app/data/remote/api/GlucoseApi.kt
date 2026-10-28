package com.hms.app.data.remote.api

import com.hms.app.data.remote.dto.CreateGlucoseReadingDto
import com.hms.app.data.remote.dto.GlucoseReadingDto
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface GlucoseApi {
    @POST("glucose/me")
    suspend fun logGlucoseReading(@Body request: CreateGlucoseReadingDto): Response<GlucoseReadingDto>

    @GET("glucose/me")
    suspend fun getGlucoseReadings(): Response<List<GlucoseReadingDto>>
}
