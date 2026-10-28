package com.hms.app.ui.screens.medications

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.hms.app.domain.model.Medication
import com.hms.app.domain.repository.MedicationRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class MedicationsViewModel @Inject constructor(
    private val repository: MedicationRepository
) : ViewModel() {

    val medicationsState: StateFlow<List<Medication>> = repository.getMedicationsFlow()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    init {
        refresh()
    }

    fun refresh() {
        viewModelScope.launch {
            repository.fetchMedications()
        }
    }
}
