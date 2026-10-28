package com.hms.app.data.repository

import com.hms.app.data.local.dao.MedicationDao
import com.hms.app.data.mapper.toDomain
import com.hms.app.data.mapper.toEntity
import com.hms.app.data.remote.api.MedicationApi
import com.hms.app.domain.model.Medication
import com.hms.app.domain.repository.MedicationRepository
import com.hms.app.util.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject

class MedicationRepositoryImpl @Inject constructor(
    private val medicationDao: MedicationDao,
    private val medicationApi: MedicationApi
) : MedicationRepository {

    override fun getMedicationsFlow(): Flow<List<Medication>> {
        return medicationDao.getActiveMedicationsFlow().map { entities ->
            entities.map { it.toDomain() }
        }
    }

    override suspend fun fetchMedications(): Resource<List<Medication>> {
        return try {
            val response = medicationApi.getMedications()
            if (response.isSuccessful && response.body() != null) {
                val dtos = response.body()!!
                val entities = dtos.map { it.toEntity() }
                medicationDao.insertMedications(entities)
                Resource.Success(entities.map { it.toDomain() })
            } else {
                Resource.Error(response.message().ifEmpty { "Failed to fetch medications" })
            }
        } catch (e: Exception) {
            Resource.Error(e.localizedMessage ?: "Network error")
        }
    }
}
