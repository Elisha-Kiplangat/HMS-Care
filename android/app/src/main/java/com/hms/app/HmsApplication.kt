package com.hms.app

import android.app.Application
import com.hms.app.notifications.NotificationChannels
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class HmsApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        NotificationChannels.createAllChannels(this)
    }
}
