package com.hms.app.domain.repository

import com.hms.app.domain.model.Hba1cResult
import com.hms.app.util.Resource
import kotlinx.coroutines.flow.Flow

interface Hba1cRepository {
    fun getHba1cResultsFlow(): Flow<List<Hba1cResult>>
    suspend fun fetchHba1cResults(): Resource<List<Hba1cResult>>
}
