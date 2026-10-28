package com.hms.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "appointments")
data class AppointmentEntity(
    @PrimaryKey val id: String,
    val patientId: String,
    val clinicianId: String,
    val clinicianName: String?,
    val startTime: String,
    val endTime: String,
    val mode: String,
    val status: String,
    val reason: String?
)
