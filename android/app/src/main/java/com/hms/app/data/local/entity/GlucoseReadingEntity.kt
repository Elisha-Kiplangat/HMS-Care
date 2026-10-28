package com.hms.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "glucose_readings")
data class GlucoseReadingEntity(
    @PrimaryKey val id: String,
    val patientId: String,
    val value: Double,
    val context: String,
    val notes: String?,
    val source: String,
    val measuredAt: String,
    val isSynced: Boolean
)
