package com.hms.app.domain.usecase

import com.hms.app.domain.model.Medication
import com.hms.app.domain.repository.MedicationRepository
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class GetMedicationSchedule @Inject constructor(
    private val repository: MedicationRepository
) {
    operator fun invoke(): Flow<List<Medication>> {
        return repository.getMedicationsFlow()
    }
}
