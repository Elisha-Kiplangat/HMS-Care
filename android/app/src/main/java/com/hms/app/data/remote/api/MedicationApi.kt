package com.hms.app.data.remote.api

import com.hms.app.data.remote.dto.MedicationDto
import retrofit2.Response
import retrofit2.http.GET

interface MedicationApi {
    @GET("medications/me")
    suspend fun getMedications(): Response<List<MedicationDto>>
}
