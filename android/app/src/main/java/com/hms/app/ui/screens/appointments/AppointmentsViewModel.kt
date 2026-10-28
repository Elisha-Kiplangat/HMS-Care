package com.hms.app.ui.screens.appointments

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.hms.app.domain.model.Appointment
import com.hms.app.domain.repository.AppointmentRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AppointmentsViewModel @Inject constructor(
    private val repository: AppointmentRepository
) : ViewModel() {

    val appointmentsState: StateFlow<List<Appointment>> = repository.getAppointmentsFlow()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    init {
        refresh()
    }

    fun refresh() {
        viewModelScope.launch {
            repository.fetchAppointments()
        }
    }
}
