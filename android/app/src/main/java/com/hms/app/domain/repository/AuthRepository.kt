package com.hms.app.domain.repository

import com.hms.app.domain.model.User
import com.hms.app.util.Resource
import kotlinx.coroutines.flow.Flow

interface AuthRepository {
    fun getCurrentUserFlow(): Flow<User?>
    suspend fun me(): User?
    suspend fun login(email: String, pass: String): Resource<User>
    suspend fun acceptInvitation(token: String, pass: String, firstName: String, lastName: String): Resource<Unit>
    suspend fun logout(): Resource<Unit>
    suspend fun isLoggedIn(): Boolean
}
