package com.hms.app.di

import android.content.Context
import androidx.room.Room
import com.hms.app.data.local.HmsDatabase
import com.hms.app.data.local.dao.AppointmentDao
import com.hms.app.data.local.dao.GlucoseDao
import com.hms.app.data.local.dao.Hba1cDao
import com.hms.app.data.local.dao.MedicationDao
import com.hms.app.data.local.dao.SyncQueueDao
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): HmsDatabase {
        return Room.databaseBuilder(
            context,
            HmsDatabase::class.java,
            "hms_db"
        ).fallbackToDestructiveMigration().build()
    }

    @Provides
    fun provideGlucoseDao(db: HmsDatabase): GlucoseDao = db.glucoseDao()

    @Provides
    fun provideHba1cDao(db: HmsDatabase): Hba1cDao = db.hba1cDao()

    @Provides
    fun provideMedicationDao(db: HmsDatabase): MedicationDao = db.medicationDao()

    @Provides
    fun provideAppointmentDao(db: HmsDatabase): AppointmentDao = db.appointmentDao()

    @Provides
    fun provideSyncQueueDao(db: HmsDatabase): SyncQueueDao = db.syncQueueDao()
}
