package com.hms.app.domain.usecase

import com.hms.app.domain.model.RefillRequest
import com.hms.app.domain.repository.RefillRepository
import com.hms.app.util.Resource
import javax.inject.Inject

class RequestRefill @Inject constructor(
    private val repository: RefillRepository
) {
    suspend operator fun invoke(medicationId: String, notes: String? = null): Resource<RefillRequest> {
        return repository.requestRefill(medicationId, notes)
    }
}
