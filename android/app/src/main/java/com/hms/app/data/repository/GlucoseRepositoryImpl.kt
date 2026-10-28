package com.hms.app.data.repository

import com.hms.app.data.local.dao.GlucoseDao
import com.hms.app.data.local.dao.SyncQueueDao
import com.hms.app.data.local.entity.SyncQueueEntity
import com.hms.app.data.mapper.toDomain
import com.hms.app.data.mapper.toEntity
import com.hms.app.data.remote.api.GlucoseApi
import com.hms.app.data.remote.dto.CreateGlucoseReadingDto
import com.hms.app.domain.model.GlucoseReading
import com.hms.app.domain.repository.GlucoseRepository
import com.hms.app.util.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import javax.inject.Inject

class GlucoseRepositoryImpl @Inject constructor(
    private val glucoseDao: GlucoseDao,
    private val syncQueueDao: SyncQueueDao,
    private val glucoseApi: GlucoseApi
) : GlucoseRepository {

    override fun getGlucoseReadingsFlow(): Flow<List<GlucoseReading>> {
        return glucoseDao.getAllReadingsFlow().map { entities ->
            entities.map { it.toDomain() }
        }
    }

    override suspend fun logGlucoseReading(reading: GlucoseReading): Resource<GlucoseReading> {
        // Save locally first (offline-first)
        val entity = reading.toEntity()
        glucoseDao.insertReading(entity)

        // Queue for background sync
        val createDto = CreateGlucoseReadingDto(
            value = reading.value,
            context = reading.context.name,
            notes = reading.notes,
            source = reading.source,
            measuredAt = reading.measuredAt
        )
        val payloadJson = Json.encodeToString(createDto)
        syncQueueDao.enqueue(
            SyncQueueEntity(
                id = reading.id,
                type = "GLUCOSE_READING",
                payloadJson = payloadJson
            )
        )

        // Try direct sync
        try {
            val response = glucoseApi.logGlucoseReading(createDto)
            if (response.isSuccessful && response.body() != null) {
                val remoteDto = response.body()!!
                glucoseDao.insertReading(remoteDto.toEntity(isSynced = true))
                syncQueueDao.dequeue(reading.id)
                return Resource.Success(remoteDto.toEntity(isSynced = true).toDomain())
            }
        } catch (_: Exception) {
            // Keep in queue for background worker sync
        }

        return Resource.Success(reading)
    }

    override suspend fun fetchGlucoseReadings(): Resource<List<GlucoseReading>> {
        return try {
            val response = glucoseApi.getGlucoseReadings()
            if (response.isSuccessful && response.body() != null) {
                val dtos = response.body()!!
                val entities = dtos.map { it.toEntity(isSynced = true) }
                glucoseDao.insertReadings(entities)
                Resource.Success(entities.map { it.toDomain() })
            } else {
                Resource.Error(response.message().ifEmpty { "Failed to fetch glucose readings" })
            }
        } catch (e: Exception) {
            Resource.Error(e.localizedMessage ?: "Network error")
        }
    }

    override suspend fun syncPendingReadings(): Resource<Unit> {
        val pendingItems = syncQueueDao.getPendingSyncItems()
        for (item in pendingItems) {
            if (item.type == "GLUCOSE_READING") {
                try {
                    val createDto = Json.decodeFromString<CreateGlucoseReadingDto>(item.payloadJson)
                    val response = glucoseApi.logGlucoseReading(createDto)
                    if (response.isSuccessful && response.body() != null) {
                        val remoteDto = response.body()!!
                        glucoseDao.insertReading(remoteDto.toEntity(isSynced = true))
                        syncQueueDao.dequeue(item.id)
                    }
                } catch (_: Exception) {
                    // Backoff
                }
            }
        }
        return Resource.Success(Unit)
    }
}
