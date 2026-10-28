package com.hms.app.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.hms.app.data.local.entity.Hba1cEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface Hba1cDao {
    @Query("SELECT * FROM hba1c_results ORDER BY resultDate DESC")
    fun getAllResultsFlow(): Flow<List<Hba1cEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertResults(results: List<Hba1cEntity>)
}
