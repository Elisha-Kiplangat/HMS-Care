package com.hms.app.domain.repository

import com.hms.app.domain.model.RefillRequest
import com.hms.app.util.Resource
import kotlinx.coroutines.flow.Flow

interface RefillRepository {
    fun getRefillRequestsFlow(): Flow<List<RefillRequest>>
    suspend fun requestRefill(medicationId: String, notes: String?): Resource<RefillRequest>
    suspend fun fetchRefillRequests(): Resource<List<RefillRequest>>
}
