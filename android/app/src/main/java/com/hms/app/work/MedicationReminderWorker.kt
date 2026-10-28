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
class MedicationReminderWorker @AssistedInject constructor(
    @Assisted private val context: Context,
    @Assisted params: WorkerParameters,
    private val notificationHelper: NotificationHelper
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        val medName = inputData.getString("medicationName") ?: "Medication"
        val dose = inputData.getString("dose") ?: ""

        notificationHelper.showNotification(
            id = System.currentTimeMillis().toInt(),
            channelId = NotificationChannels.CHANNEL_MEDICATIONS,
            title = "Time for your medication",
            body = "Take $medName $dose"
        )
        return Result.success()
    }
}
