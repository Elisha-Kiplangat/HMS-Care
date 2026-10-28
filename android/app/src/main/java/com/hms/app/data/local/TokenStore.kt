package com.hms.app.data.local

import android.content.Context
import android.content.SharedPreferences
import com.hms.app.domain.model.User
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class TokenStore @Inject constructor(
    @ApplicationContext context: Context
) {
    private val prefs: SharedPreferences = context.getSharedPreferences("hms_secure_prefs", Context.MODE_PRIVATE)

    private val _currentUser = MutableStateFlow<User?>(getUser())
    val currentUserFlow: StateFlow<User?> = _currentUser

    fun saveTokens(accessToken: String, refreshToken: String) {
        prefs.edit()
            .putString(KEY_ACCESS_TOKEN, accessToken)
            .putString(KEY_REFRESH_TOKEN, refreshToken)
            .apply()
    }

    fun getAccessToken(): String? = prefs.getString(KEY_ACCESS_TOKEN, null)
    fun getRefreshToken(): String? = prefs.getString(KEY_REFRESH_TOKEN, null)

    fun saveUser(user: User) {
        prefs.edit()
            .putString(KEY_USER_ID, user.id)
            .putString(KEY_USER_EMAIL, user.email)
            .putString(KEY_USER_FIRST_NAME, user.firstName)
            .putString(KEY_USER_LAST_NAME, user.lastName)
            .putString(KEY_USER_ROLE, user.role)
            .putString(KEY_TENANT_ID, user.tenantId)
            .putString(KEY_TENANT_NAME, user.tenantName)
            .apply()
        _currentUser.value = user
    }

    fun getUser(): User? {
        val id = prefs.getString(KEY_USER_ID, null) ?: return null
        val email = prefs.getString(KEY_USER_EMAIL, "") ?: ""
        val firstName = prefs.getString(KEY_USER_FIRST_NAME, "") ?: ""
        val lastName = prefs.getString(KEY_USER_LAST_NAME, "") ?: ""
        val role = prefs.getString(KEY_USER_ROLE, "PATIENT") ?: "PATIENT"
        val tenantId = prefs.getString(KEY_TENANT_ID, null)
        val tenantName = prefs.getString(KEY_TENANT_NAME, null)

        return User(
            id = id,
            email = email,
            firstName = firstName,
            lastName = lastName,
            role = role,
            tenantId = tenantId,
            tenantName = tenantName
        )
    }

    fun clear() {
        prefs.edit().clear().apply()
        _currentUser.value = null
    }

    companion object {
        private const val KEY_ACCESS_TOKEN = "access_token"
        private const val KEY_REFRESH_TOKEN = "refresh_token"
        private const val KEY_USER_ID = "user_id"
        private const val KEY_USER_EMAIL = "user_email"
        private const val KEY_USER_FIRST_NAME = "user_first_name"
        private const val KEY_USER_LAST_NAME = "user_last_name"
        private const val KEY_USER_ROLE = "user_role"
        private const val KEY_TENANT_ID = "tenant_id"
        private const val KEY_TENANT_NAME = "tenant_name"
    }
}
