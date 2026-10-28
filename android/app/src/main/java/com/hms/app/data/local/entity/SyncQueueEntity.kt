package com.hms.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "sync_queue")
data class SyncQueueEntity(
    @PrimaryKey val id: String,
    val type: String = "GLUCOSE_READING",
    val payloadJson: String,
    val createdAt: Long = System.currentTimeMillis()
)
