package com.hms.app.domain.repository

import com.hms.app.domain.model.Medication
import com.hms.app.util.Resource
import kotlinx.coroutines.flow.Flow

interface MedicationRepository {
    fun getMedicationsFlow(): Flow<List<Medication>>
    suspend fun fetchMedications(): Resource<List<Medication>>
}
