package com.hms.app.ui.screens.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.hms.app.domain.model.Appointment
import com.hms.app.domain.model.GlucoseReading
import com.hms.app.domain.model.Hba1cResult
import com.hms.app.domain.model.Medication
import com.hms.app.domain.model.RiskLevel
import com.hms.app.domain.model.User
import com.hms.app.domain.repository.AppointmentRepository
import com.hms.app.domain.repository.AuthRepository
import com.hms.app.domain.repository.GlucoseRepository
import com.hms.app.domain.repository.Hba1cRepository
import com.hms.app.domain.repository.MedicationRepository
import com.hms.app.domain.usecase.ClassifyReading
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

data class HomeUiState(
    val user: User? = null,
    val lastReading: GlucoseReading? = null,
    val lastReadingRisk: RiskLevel? = null,
    val latestHba1c: Hba1cResult? = null,
    val nextMedication: Medication? = null,
    val upcomingAppointment: Appointment? = null,
    val isLoading: Boolean = false
)

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val glucoseRepository: GlucoseRepository,
    private val hba1cRepository: Hba1cRepository,
    private val medicationRepository: MedicationRepository,
    private val appointmentRepository: AppointmentRepository,
    private val classifyReading: ClassifyReading
) : ViewModel() {

    val uiState: StateFlow<HomeUiState> = combine(
        authRepository.getCurrentUserFlow(),
        glucoseRepository.getGlucoseReadingsFlow(),
        hba1cRepository.getHba1cResultsFlow(),
        medicationRepository.getMedicationsFlow(),
        appointmentRepository.getAppointmentsFlow()
    ) { user, readings, hba1cs, meds, appts ->
        val lastReading = readings.firstOrNull()
        val risk = lastReading?.let { classifyReading(it.value) }
        HomeUiState(
            user = user,
            lastReading = lastReading,
            lastReadingRisk = risk,
            latestHba1c = hba1cs.firstOrNull(),
            nextMedication = meds.firstOrNull(),
            upcomingAppointment = appts.firstOrNull { it.status == "SCHEDULED" }
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = HomeUiState(isLoading = true)
    )

    init {
        refreshData()
    }

    fun refreshData() {
        viewModelScope.launch {
            glucoseRepository.fetchGlucoseReadings()
            hba1cRepository.fetchHba1cResults()
            medicationRepository.fetchMedications()
            appointmentRepository.fetchAppointments()
        }
    }
}
