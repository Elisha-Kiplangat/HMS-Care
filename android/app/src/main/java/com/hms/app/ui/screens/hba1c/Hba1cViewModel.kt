package com.hms.app.ui.screens.hba1c

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.hms.app.domain.model.Hba1cResult
import com.hms.app.domain.repository.Hba1cRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class Hba1cViewModel @Inject constructor(
    private val repository: Hba1cRepository
) : ViewModel() {

    val hba1cState: StateFlow<List<Hba1cResult>> = repository.getHba1cResultsFlow()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    init {
        refresh()
    }

    fun refresh() {
        viewModelScope.launch {
            repository.fetchHba1cResults()
        }
    }
}
