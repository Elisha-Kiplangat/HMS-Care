package com.hms.app.data.repository

import com.hms.app.data.local.TokenStore
import com.hms.app.data.mapper.toDomain
import com.hms.app.data.remote.api.AuthApi
import com.hms.app.data.remote.dto.AcceptInvitationRequestDto
import com.hms.app.data.remote.dto.LoginRequestDto
import com.hms.app.domain.model.User
import com.hms.app.domain.repository.AuthRepository
import com.hms.app.util.Resource
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class AuthRepositoryImpl @Inject constructor(
    private val authApi: AuthApi,
    private val tokenStore: TokenStore
) : AuthRepository {

    override fun getCurrentUserFlow(): Flow<User?> = tokenStore.currentUserFlow

    override suspend fun me(): User? = tokenStore.getUser()

    override suspend fun login(email: String, pass: String): Resource<User> {
        return try {
            val response = authApi.login(LoginRequestDto(email, pass))
            if (response.isSuccessful && response.body() != null) {
                val body = response.body()!!
                tokenStore.saveTokens(body.accessToken, body.refreshToken)
                val user = body.user.toDomain()
                tokenStore.saveUser(user)
                Resource.Success(user)
            } else {
                Resource.Error(response.message().ifEmpty { "Login failed" })
            }
        } catch (e: Exception) {
            Resource.Error(e.localizedMessage ?: "Network error")
        }
    }

    override suspend fun acceptInvitation(token: String, pass: String, firstName: String, lastName: String): Resource<Unit> {
        return try {
            val response = authApi.acceptInvitation(AcceptInvitationRequestDto(token, pass, firstName, lastName))
            if (response.isSuccessful) {
                Resource.Success(Unit)
            } else {
                Resource.Error(response.message().ifEmpty { "Invitation failed" })
            }
        } catch (e: Exception) {
            Resource.Error(e.localizedMessage ?: "Network error")
        }
    }

    override suspend fun logout(): Resource<Unit> {
        try {
            authApi.logout()
        } catch (_: Exception) {}
        tokenStore.clear()
        return Resource.Success(Unit)
    }

    override suspend fun isLoggedIn(): Boolean {
        return tokenStore.getAccessToken() != null
    }
}
