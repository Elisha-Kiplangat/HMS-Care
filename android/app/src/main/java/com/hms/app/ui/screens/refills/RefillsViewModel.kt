package com.hms.app.ui.screens.refills

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.hms.app.domain.model.Medication
import com.hms.app.domain.model.RefillRequest
import com.hms.app.domain.repository.MedicationRepository
import com.hms.app.domain.repository.RefillRepository
import com.hms.app.util.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

data class RefillUiState(
    val selectedMedicationId: String? = null,
    val notes: String = "",
    val isSubmitting: Boolean = false,
    val isSuccess: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class RefillsViewModel @Inject constructor(
    private val refillRepository: RefillRepository,
    medicationRepository: MedicationRepository
) : ViewModel() {

    val refillsState: StateFlow<List<RefillRequest>> = refillRepository.getRefillRequestsFlow()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val medicationsState: StateFlow<List<Medication>> = medicationRepository.getMedicationsFlow()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val _uiState = MutableStateFlow(RefillUiState())
    val uiState: StateFlow<RefillUiState> = _uiState

    init {
        viewModelScope.launch {
            refillRepository.fetchRefillRequests()
            medicationRepository.fetchMedications()
        }
    }

    fun selectMedication(id: String) {
        _uiState.value = _uiState.value.copy(selectedMedicationId = id, error = null)
    }

    fun onNotesChange(notes: String) {
        _uiState.value = _uiState.value.copy(notes = notes)
    }

    fun submitRequest() {
        val medId = _uiState.value.selectedMedicationId
        if (medId.isNullOrEmpty()) {
            _uiState.value = _uiState.value.copy(error = "Please select a medication")
            return
        }

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSubmitting = true)
            when (val res = refillRepository.requestRefill(medId, _uiState.value.notes)) {
                is Resource.Success -> {
                    _uiState.value = _uiState.value.copy(isSubmitting = false, isSuccess = true)
                }
                is Resource.Error -> {
                    _uiState.value = _uiState.value.copy(isSubmitting = false, error = res.message)
                }
                else -> {}
            }
        }
    }
}
