package com.hms.app.notifications

import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@AndroidEntryPoint
class HmsFirebaseMessagingService : FirebaseMessagingService() {

    @Inject
    lateinit var notificationHelper: NotificationHelper

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        // Upload token to backend device tokens endpoint
    }

    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)
        val title = message.notification?.title ?: message.data["title"] ?: "HMS Alert"
        val body = message.notification?.body ?: message.data["body"] ?: ""
        val channelId = message.data["channel"] ?: NotificationChannels.CHANNEL_APPOINTMENTS

        notificationHelper.showNotification(
            id = System.currentTimeMillis().toInt(),
            channelId = channelId,
            title = title,
            body = body
        )
    }
}
