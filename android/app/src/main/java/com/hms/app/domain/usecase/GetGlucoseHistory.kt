package com.hms.app.domain.usecase

import com.hms.app.domain.model.GlucoseReading
import com.hms.app.domain.repository.GlucoseRepository
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class GetGlucoseHistory @Inject constructor(
    private val repository: GlucoseRepository
) {
    operator fun invoke(): Flow<List<GlucoseReading>> {
        return repository.getGlucoseReadingsFlow()
    }
}
