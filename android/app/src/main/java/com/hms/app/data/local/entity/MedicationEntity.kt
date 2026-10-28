package com.hms.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "medications")
data class MedicationEntity(
    @PrimaryKey val id: String,
    val patientId: String,
    val name: String,
    val dose: String,
    val instructions: String?,
    val quantityDispensed: Int,
    val isActive: Boolean,
    val schedulesJson: String
)
