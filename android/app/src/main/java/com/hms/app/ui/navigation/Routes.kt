package com.hms.app.ui.navigation

object Routes {
    const val LOGIN = "login"
    const val ACCEPT_INVITATION = "accept_invitation"
    const val HOME = "home"
    const val LOG_GLUCOSE = "log_glucose"
    const val GLUCOSE_HISTORY = "glucose_history"
    const val HBA1C = "hba1c"
    const val MEDICATIONS = "medications"
    const val REFILLS = "refills"
    const val APPOINTMENTS = "appointments"
    const val PRE_CALL = "pre_call/{appointmentId}"
    const val VIDEO_CALL = "video_call/{appointmentId}"
    const val AUDIO_CALL = "audio_call/{appointmentId}"
    const val PROFILE = "profile"

    fun preCall(appointmentId: String) = "pre_call/$appointmentId"
    fun videoCall(appointmentId: String) = "video_call/$appointmentId"
    fun audioCall(appointmentId: String) = "audio_call/$appointmentId"
}
