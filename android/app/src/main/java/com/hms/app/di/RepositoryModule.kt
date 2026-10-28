package com.hms.app.di

import com.hms.app.data.repository.AppointmentRepositoryImpl
import com.hms.app.data.repository.AuthRepositoryImpl
import com.hms.app.data.repository.GlucoseRepositoryImpl
import com.hms.app.data.repository.Hba1cRepositoryImpl
import com.hms.app.data.repository.MedicationRepositoryImpl
import com.hms.app.data.repository.RefillRepositoryImpl
import com.hms.app.domain.repository.AppointmentRepository
import com.hms.app.domain.repository.AuthRepository
import com.hms.app.domain.repository.GlucoseRepository
import com.hms.app.domain.repository.Hba1cRepository
import com.hms.app.domain.repository.MedicationRepository
import com.hms.app.domain.repository.RefillRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    @Singleton
    abstract fun bindAuthRepository(impl: AuthRepositoryImpl): AuthRepository

    @Binds
    @Singleton
    abstract fun bindGlucoseRepository(impl: GlucoseRepositoryImpl): GlucoseRepository

    @Binds
    @Singleton
    abstract fun bindHba1cRepository(impl: Hba1cRepositoryImpl): Hba1cRepository

    @Binds
    @Singleton
    abstract fun bindMedicationRepository(impl: MedicationRepositoryImpl): MedicationRepository

    @Binds
    @Singleton
    abstract fun bindRefillRepository(impl: RefillRepositoryImpl): RefillRepository

    @Binds
    @Singleton
    abstract fun bindAppointmentRepository(impl: AppointmentRepositoryImpl): AppointmentRepository
}
