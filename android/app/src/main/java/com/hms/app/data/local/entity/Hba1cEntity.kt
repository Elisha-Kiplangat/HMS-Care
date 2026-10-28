package com.hms.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "hba1c_results")
data class Hba1cEntity(
    @PrimaryKey val id: String,
    val patientId: String,
    val value: Double,
    val resultDate: String,
    val notes: String?,
    val recordedBy: String?
)
