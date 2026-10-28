package com.hms.app.domain.repository

import com.hms.app.domain.model.GlucoseReading
import com.hms.app.util.Resource
import kotlinx.coroutines.flow.Flow

interface GlucoseRepository {
    fun getGlucoseReadingsFlow(): Flow<List<GlucoseReading>>
    suspend fun logGlucoseReading(reading: GlucoseReading): Resource<GlucoseReading>
    suspend fun fetchGlucoseReadings(): Resource<List<GlucoseReading>>
    suspend fun syncPendingReadings(): Resource<Unit>
}
