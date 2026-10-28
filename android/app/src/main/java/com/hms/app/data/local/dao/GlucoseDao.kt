package com.hms.app.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.hms.app.data.local.entity.GlucoseReadingEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface GlucoseDao {
    @Query("SELECT * FROM glucose_readings ORDER BY measuredAt DESC")
    fun getAllReadingsFlow(): Flow<List<GlucoseReadingEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertReading(reading: GlucoseReadingEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertReadings(readings: List<GlucoseReadingEntity>)

    @Query("UPDATE glucose_readings SET isSynced = 1 WHERE id = :id")
    suspend fun markSynced(id: String)
}
