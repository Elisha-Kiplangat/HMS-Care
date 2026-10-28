package com.hms.app.domain.usecase

import com.hms.app.domain.repository.GlucoseRepository
import com.hms.app.util.Resource
import javax.inject.Inject

class SyncPendingReadings @Inject constructor(
    private val repository: GlucoseRepository
) {
    suspend operator fun invoke(): Resource<Unit> {
        return repository.syncPendingReadings()
    }
}
