package com.hms.app.ui.screens.glucose

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.hms.app.domain.model.GlucoseContext
import com.hms.app.domain.model.GlucoseReading
import com.hms.app.domain.model.RiskLevel
import com.hms.app.domain.usecase.ClassifyReading
import com.hms.app.domain.usecase.GetGlucoseHistory
import com.hms.app.domain.usecase.LogGlucoseReading
import com.hms.app.util.DateTimeUtils
import com.hms.app.util.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.util.UUID
import javax.inject.Inject

data class LogGlucoseUiState(
    val valueInput: String = "",
    val context: GlucoseContext = GlucoseContext.FASTING,
    val notes: String = "",
    val classifiedRisk: RiskLevel? = null,
    val isSaving: Boolean = false,
    val isSaved: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class GlucoseViewModel @Inject constructor(
    getGlucoseHistory: GetGlucoseHistory,
    private val logGlucoseReadingUseCase: LogGlucoseReading,
    private val classifyReading: ClassifyReading
) : ViewModel() {

    val historyState: StateFlow<List<GlucoseReading>> = getGlucoseHistory()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val _logUiState = MutableStateFlow(LogGlucoseUiState())
    val logUiState: StateFlow<LogGlucoseUiState> = _logUiState

    fun onValueInput(input: String) {
        val valDouble = input.toDoubleOrNull()
        val risk = valDouble?.let { classifyReading(it) }
        _logUiState.value = _logUiState.value.copy(
            valueInput = input,
            classifiedRisk = risk,
            error = null
        )
    }

    fun onContextChange(context: GlucoseContext) {
        _logUiState.value = _logUiState.value.copy(context = context)
    }

    fun onNotesChange(notes: String) {
        _logUiState.value = _logUiState.value.copy(notes = notes)
    }

    fun logReading() {
        val state = _logUiState.value
        val valDouble = state.valueInput.toDoubleOrNull()
        if (valDouble == null || valDouble <= 0.0) {
            _logUiState.value = state.copy(error = "Please enter a valid glucose reading")
            return
        }

        viewModelScope.launch {
            _logUiState.value = _logUiState.value.copy(isSaving = true)
            val newReading = GlucoseReading(
                id = UUID.randomUUID().toString(),
                patientId = "me",
                value = valDouble,
                context = state.context,
                notes = state.notes.ifBlank { null },
                measuredAt = DateTimeUtils.getCurrentIsoTime(),
                isSynced = false
            )

            when (val res = logGlucoseReadingUseCase(newReading)) {
                is Resource.Success -> {
                    _logUiState.value = _logUiState.value.copy(isSaving = false, isSaved = true)
                }
                is Resource.Error -> {
                    _logUiState.value = _logUiState.value.copy(isSaving = false, error = res.message)
                }
                else -> {}
            }
        }
    }
}
