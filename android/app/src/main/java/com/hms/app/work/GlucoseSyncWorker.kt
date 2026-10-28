package com.hms.app.work

import android.content.Context
import androidx.hilt.work.HiltWorker
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.hms.app.domain.usecase.SyncPendingReadings
import com.hms.app.util.Resource
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject

@HiltWorker
class GlucoseSyncWorker @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted params: WorkerParameters,
    private val syncPendingReadings: SyncPendingReadings
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        return when (syncPendingReadings()) {
            is Resource.Success -> Result.success()
            else -> Result.retry()
        }
    }
}
