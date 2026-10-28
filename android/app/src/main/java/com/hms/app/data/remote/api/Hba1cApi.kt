package com.hms.app.data.remote.api

import com.hms.app.data.remote.dto.Hba1cResultDto
import retrofit2.Response
import retrofit2.http.GET

interface Hba1cApi {
    @GET("hba1c/me")
    suspend fun getHba1cResults(): Response<List<Hba1cResultDto>>
}
