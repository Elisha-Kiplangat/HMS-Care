package com.hms.app.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import com.hms.app.data.local.dao.AppointmentDao
import com.hms.app.data.local.dao.GlucoseDao
import com.hms.app.data.local.dao.Hba1cDao
import com.hms.app.data.local.dao.MedicationDao
import com.hms.app.data.local.dao.SyncQueueDao
import com.hms.app.data.local.entity.AppointmentEntity
import com.hms.app.data.local.entity.GlucoseReadingEntity
import com.hms.app.data.local.entity.Hba1cEntity
import com.hms.app.data.local.entity.MedicationEntity
import com.hms.app.data.local.entity.SyncQueueEntity

@Database(
    entities = [
        GlucoseReadingEntity::class,
        Hba1cEntity::class,
        MedicationEntity::class,
        AppointmentEntity::class,
        SyncQueueEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class HmsDatabase : RoomDatabase() {
    abstract fun glucoseDao(): GlucoseDao
    abstract fun hba1cDao(): Hba1cDao
    abstract fun medicationDao(): MedicationDao
    abstract fun appointmentDao(): AppointmentDao
    abstract fun syncQueueDao(): SyncQueueDao
}
