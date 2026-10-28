package com.hms.app.work

import android.content.Context
import androidx.hilt.work.HiltWorker
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.hms.app.notifications.NotificationChannels
import com.hms.app.notifications.NotificationHelper
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject

@HiltWorker
class RefillReminderWorker @AssistedInject constructor(
    @Assisted private val context: Context,
    @Assisted params: WorkerParameters,
    private val notificationHelper: NotificationHelper
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        val medName = inputData.getString("medicationName") ?: "Medication"

        notificationHelper.showNotification(
            id = System.currentTimeMillis().toInt(),
            channelId = NotificationChannels.CHANNEL_REFILLS,
            title = "Embu Level 5 Pharmacy Refill",
            body = "Your supply of $medName is running low. Tap to request a refill."
        )
        return Result.success()
    }
}
