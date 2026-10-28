package com.hms.app.data.repository

import com.hms.app.data.mapper.toDomain
import com.hms.app.data.remote.api.RefillApi
import com.hms.app.data.remote.dto.CreateRefillRequestDto
import com.hms.app.domain.model.RefillRequest
import com.hms.app.domain.repository.RefillRepository
import com.hms.app.util.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import javax.inject.Inject

class RefillRepositoryImpl @Inject constructor(
    private val refillApi: RefillApi
) : RefillRepository {

    private val refillsFlow = MutableStateFlow<List<RefillRequest>>(emptyList())

    override fun getRefillRequestsFlow(): Flow<List<RefillRequest>> = refillsFlow

    override suspend fun requestRefill(medicationId: String, notes: String?): Resource<RefillRequest> {
        return try {
            val response = refillApi.requestRefill(CreateRefillRequestDto(medicationId, notes))
            if (response.isSuccessful && response.body() != null) {
                val dto = response.body()!!
                val domain = dto.toDomain()
                fetchRefillRequests()
                Resource.Success(domain)
            } else {
                Resource.Error(response.message().ifEmpty { "Failed to submit refill request" })
            }
        } catch (e: Exception) {
            Resource.Error(e.localizedMessage ?: "Network error")
        }
    }

    override suspend fun fetchRefillRequests(): Resource<List<RefillRequest>> {
        return try {
            val response = refillApi.getRefills()
            if (response.isSuccessful && response.body() != null) {
                val dtos = response.body()!!
                val domainList = dtos.map { it.toDomain() }
                refillsFlow.value = domainList
                Resource.Success(domainList)
            } else {
                Resource.Error(response.message().ifEmpty { "Failed to fetch refills" })
            }
        } catch (e: Exception) {
            Resource.Error(e.localizedMessage ?: "Network error")
        }
    }
}
