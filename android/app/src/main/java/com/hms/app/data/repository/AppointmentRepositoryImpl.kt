package com.hms.app.data.repository

import com.hms.app.data.local.dao.AppointmentDao
import com.hms.app.data.mapper.toDomain
import com.hms.app.data.mapper.toEntity
import com.hms.app.data.remote.api.AppointmentApi
import com.hms.app.domain.model.Appointment
import com.hms.app.domain.repository.AppointmentRepository
import com.hms.app.util.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject

class AppointmentRepositoryImpl @Inject constructor(
    private val appointmentDao: AppointmentDao,
    private val appointmentApi: AppointmentApi
) : AppointmentRepository {

    override fun getAppointmentsFlow(): Flow<List<Appointment>> {
        return appointmentDao.getAppointmentsFlow().map { entities ->
            entities.map { it.toDomain() }
        }
    }

    override suspend fun fetchAppointments(): Resource<List<Appointment>> {
        return try {
            val response = appointmentApi.getAppointments()
            if (response.isSuccessful && response.body() != null) {
                val dtos = response.body()!!
                val entities = dtos.map { it.toEntity() }
                appointmentDao.insertAppointments(entities)
                Resource.Success(entities.map { it.toDomain() })
            } else {
                Resource.Error(response.message().ifEmpty { "Failed to fetch appointments" })
            }
        } catch (e: Exception) {
            Resource.Error(e.localizedMessage ?: "Network error")
        }
    }
}
