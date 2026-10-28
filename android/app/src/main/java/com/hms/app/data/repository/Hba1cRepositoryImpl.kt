package com.hms.app.data.repository

import com.hms.app.data.local.dao.Hba1cDao
import com.hms.app.data.mapper.toDomain
import com.hms.app.data.mapper.toEntity
import com.hms.app.data.remote.api.Hba1cApi
import com.hms.app.domain.model.Hba1cResult
import com.hms.app.domain.repository.Hba1cRepository
import com.hms.app.util.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject

class Hba1cRepositoryImpl @Inject constructor(
    private val hba1cDao: Hba1cDao,
    private val hba1cApi: Hba1cApi
) : Hba1cRepository {

    override fun getHba1cResultsFlow(): Flow<List<Hba1cResult>> {
        return hba1cDao.getAllResultsFlow().map { entities ->
            entities.map { it.toDomain() }
        }
    }

    override suspend fun fetchHba1cResults(): Resource<List<Hba1cResult>> {
        return try {
            val response = hba1cApi.getHba1cResults()
            if (response.isSuccessful && response.body() != null) {
                val dtos = response.body()!!
                val entities = dtos.map { it.toEntity() }
                hba1cDao.insertResults(entities)
                Resource.Success(entities.map { it.toDomain() })
            } else {
                Resource.Error(response.message().ifEmpty { "Failed to fetch HbA1c results" })
            }
        } catch (e: Exception) {
            Resource.Error(e.localizedMessage ?: "Network error")
        }
    }
}
