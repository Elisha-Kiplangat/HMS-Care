package com.hms.app.domain.usecase

import com.hms.app.domain.model.Appointment
import com.hms.app.domain.repository.AppointmentRepository
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class GetAppointments @Inject constructor(
    private val repository: AppointmentRepository
) {
    operator fun invoke(): Flow<List<Appointment>> {
        return repository.getAppointmentsFlow()
    }
}
