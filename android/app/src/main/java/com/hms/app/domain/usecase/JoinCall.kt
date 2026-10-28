package com.hms.app.domain.usecase

import com.hms.app.domain.model.CallSession
import com.hms.app.util.Resource
import javax.inject.Inject

class JoinCall @Inject constructor() {
    suspend operator fun invoke(appointmentId: String): Resource<CallSession> {
        return Resource.Success(
            CallSession(
                id = appointmentId,
                appointmentId = appointmentId,
                modeUsed = "VIDEO"
            )
        )
    }
}
