package com.hms.app.util

import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

object DateTimeUtils {
    private const val ISO_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
    private const val DISPLAY_FORMAT = "MMM dd, yyyy HH:mm"
    private const val TIME_FORMAT = "HH:mm"

    fun getCurrentIsoTime(): String {
        val sdf = SimpleDateFormat(ISO_FORMAT, Locale.US)
        sdf.timeZone = TimeZone.getTimeZone("UTC")
        return sdf.format(Date())
    }

    fun formatDisplayDate(isoString: String?): String {
        if (isoString.isNullOrEmpty()) return ""
        return try {
            val sdf = SimpleDateFormat(ISO_FORMAT, Locale.US)
            sdf.timeZone = TimeZone.getTimeZone("UTC")
            val date = sdf.parse(isoString) ?: return isoString
            val displaySdf = SimpleDateFormat(DISPLAY_FORMAT, Locale.getDefault())
            displaySdf.format(date)
        } catch (e: Exception) {
            isoString
        }
    }

    fun formatTimeOnly(isoString: String?): String {
        if (isoString.isNullOrEmpty()) return ""
        return try {
            val sdf = SimpleDateFormat(ISO_FORMAT, Locale.US)
            sdf.timeZone = TimeZone.getTimeZone("UTC")
            val date = sdf.parse(isoString) ?: return isoString
            val displaySdf = SimpleDateFormat(TIME_FORMAT, Locale.getDefault())
            displaySdf.format(date)
        } catch (e: Exception) {
            isoString
        }
    }
}
