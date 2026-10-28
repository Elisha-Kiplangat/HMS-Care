package com.hms.app.notifications

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build

object NotificationChannels {
    const val CHANNEL_MEDICATIONS = "channel_medications"
    const val CHANNEL_REFILLS = "channel_refills"
    const val CHANNEL_APPOINTMENTS = "channel_appointments"
    const val CHANNEL_CALLS = "channel_calls"

    fun createAllChannels(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

            val medChannel = NotificationChannel(
                CHANNEL_MEDICATIONS,
                "Medication Reminders",
                NotificationManager.IMPORTANCE_HIGH
            ).apply { description = "Dose reminders for daily medications" }

            val refillChannel = NotificationChannel(
                CHANNEL_REFILLS,
                "Refill Reminders",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply { description = "Pharmacy prescription refill alerts" }

            val apptChannel = NotificationChannel(
                CHANNEL_APPOINTMENTS,
                "Appointment Alerts",
                NotificationManager.IMPORTANCE_HIGH
            ).apply { description = "Notifications for virtual visits" }

            val callChannel = NotificationChannel(
                CHANNEL_CALLS,
                "Incoming Calls",
                NotificationManager.IMPORTANCE_HIGH
            ).apply { description = "Incoming telemedicine call notifications" }

            notificationManager.createNotificationChannels(
                listOf(medChannel, refillChannel, apptChannel, callChannel)
            )
        }
    }
}
