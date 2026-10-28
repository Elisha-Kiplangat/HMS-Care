package com.hms.app.domain.usecase

import com.hms.app.domain.model.Hba1cResult
import com.hms.app.domain.repository.Hba1cRepository
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class GetHba1cTrend @Inject constructor(
    private val repository: Hba1cRepository
) {
    operator fun invoke(): Flow<List<Hba1cResult>> {
        return repository.getHba1cResultsFlow()
    }
}
