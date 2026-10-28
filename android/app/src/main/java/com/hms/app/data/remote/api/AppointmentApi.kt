package com.hms.app.data.remote.api

import com.hms.app.data.remote.dto.AppointmentDto
import retrofit2.Response
import retrofit2.http.GET

interface AppointmentApi {
    @GET("appointments")
    suspend fun getAppointments(): Response<List<AppointmentDto>>
}
