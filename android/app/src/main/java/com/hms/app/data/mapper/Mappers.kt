package com.hms.app.data.mapper

import com.hms.app.data.local.entity.AppointmentEntity
import com.hms.app.data.local.entity.GlucoseReadingEntity
import com.hms.app.data.local.entity.Hba1cEntity
import com.hms.app.data.local.entity.MedicationEntity
import com.hms.app.data.remote.dto.AppointmentDto
import com.hms.app.data.remote.dto.GlucoseReadingDto
import com.hms.app.data.remote.dto.Hba1cResultDto
import com.hms.app.data.remote.dto.MedicationDto
import com.hms.app.data.remote.dto.MedicationScheduleDto
import com.hms.app.data.remote.dto.RefillRequestDto
import com.hms.app.data.remote.dto.UserDto
import com.hms.app.domain.model.Appointment
import com.hms.app.domain.model.GlucoseContext
import com.hms.app.domain.model.GlucoseReading
import com.hms.app.domain.model.Hba1cResult
import com.hms.app.domain.model.Medication
import com.hms.app.domain.model.MedicationSchedule
import com.hms.app.domain.model.RefillRequest
import com.hms.app.domain.model.User
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

fun UserDto.toDomain(): User {
    return User(
        id = id,
        email = email,
        firstName = firstName,
        lastName = lastName,
        role = role,
        tenantId = tenantId,
        tenantName = tenantName
    )
}

fun GlucoseReadingDto.toEntity(isSynced: Boolean = true): GlucoseReadingEntity {
    return GlucoseReadingEntity(
        id = id,
        patientId = patientId,
        value = value,
        context = context,
        notes = notes,
        source = source,
        measuredAt = measuredAt,
        isSynced = isSynced
    )
}

fun GlucoseReadingEntity.toDomain(): GlucoseReading {
    return GlucoseReading(
        id = id,
        patientId = patientId,
        value = value,
        context = parseGlucoseContext(context),
        notes = notes,
        source = source,
        measuredAt = measuredAt,
        isSynced = isSynced
    )
}

fun GlucoseReading.toEntity(): GlucoseReadingEntity {
    return GlucoseReadingEntity(
        id = id,
        patientId = patientId,
        value = value,
        context = context.name,
        notes = notes,
        source = source,
        measuredAt = measuredAt,
        isSynced = isSynced
    )
}

fun Hba1cResultDto.toEntity(): Hba1cEntity {
    return Hba1cEntity(
        id = id,
        patientId = patientId,
        value = value,
        resultDate = resultDate,
        notes = notes,
        recordedBy = recordedById
    )
}

fun Hba1cEntity.toDomain(): Hba1cResult {
    return Hba1cResult(
        id = id,
        patientId = patientId,
        value = value,
        resultDate = resultDate,
        notes = notes,
        recordedBy = recordedBy
    )
}

fun MedicationDto.toEntity(): MedicationEntity {
    val schedulesJson = Json.encodeToString(schedules)
    return MedicationEntity(
        id = id,
        patientId = patientId,
        name = name,
        dose = dose,
        instructions = instructions,
        quantityDispensed = quantityDispensed,
        isActive = isActive,
        schedulesJson = schedulesJson
    )
}

fun MedicationEntity.toDomain(): Medication {
    val schedulesList: List<MedicationScheduleDto> = try {
        Json.decodeFromString(schedulesJson)
    } catch (e: Exception) {
        emptyList()
    }
    return Medication(
        id = id,
        patientId = patientId,
        name = name,
        dose = dose,
        instructions = instructions,
        quantityDispensed = quantityDispensed,
        isActive = isActive,
        schedules = schedulesList.map { MedicationSchedule(it.id, it.timeOfDay, it.daysOfWeek) }
    )
}

fun RefillRequestDto.toDomain(): RefillRequest {
    return RefillRequest(
        id = id,
        patientId = patientId,
        medicationId = medicationId,
        medicationName = medication?.name,
        status = status,
        notes = notes,
        requestedAt = requestedAt,
        fulfilledAt = fulfilledAt
    )
}

fun AppointmentDto.toEntity(): AppointmentEntity {
    val name = clinician?.user?.let { "${it.firstName ?: ""} ${it.lastName ?: ""}".trim() }
    return AppointmentEntity(
        id = id,
        patientId = patientId,
        clinicianId = clinicianId,
        clinicianName = name,
        startTime = startTime,
        endTime = endTime,
        mode = mode,
        status = status,
        reason = reason
    )
}

fun AppointmentEntity.toDomain(): Appointment {
    return Appointment(
        id = id,
        patientId = patientId,
        clinicianId = clinicianId,
        clinicianName = clinicianName,
        startTime = startTime,
        endTime = endTime,
        mode = mode,
        status = status,
        reason = reason
    )
}

private fun parseGlucoseContext(str: String): GlucoseContext {
    return try {
        GlucoseContext.valueOf(str.uppercase())
    } catch (e: Exception) {
        GlucoseContext.RANDOM
    }
}
