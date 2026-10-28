package com.hms.app.domain.usecase

import com.hms.app.domain.model.GlucoseReading
import com.hms.app.domain.repository.GlucoseRepository
import com.hms.app.util.Resource
import javax.inject.Inject

class LogGlucoseReading @Inject constructor(
    private val repository: GlucoseRepository
) {
    suspend operator fun invoke(reading: GlucoseReading): Resource<GlucoseReading> {
        return repository.logGlucoseReading(reading)
    }
}
