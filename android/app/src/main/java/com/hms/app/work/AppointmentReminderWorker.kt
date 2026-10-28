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
class AppointmentReminderWorker @AssistedInject constructor(
    @Assisted private val context: Context,
    @Assisted params: WorkerParameters,
    private val notificationHelper: NotificationHelper
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        val doctorName = inputData.getString("clinicianName") ?: "your clinician"
        val time = inputData.getString("time") ?: ""

        notificationHelper.showNotification(
            id = System.currentTimeMillis().toInt(),
            channelId = NotificationChannels.CHANNEL_APPOINTMENTS,
            title = "Upcoming Virtual Appointment",
            body = "You have a consultation with $doctorName at $time."
        )
        return Result.success()
    }
}
