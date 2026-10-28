package com.hms.app.domain.repository

import com.hms.app.domain.model.Appointment
import com.hms.app.util.Resource
import kotlinx.coroutines.flow.Flow

interface AppointmentRepository {
    fun getAppointmentsFlow(): Flow<List<Appointment>>
    suspend fun fetchAppointments(): Resource<List<Appointment>>
}
