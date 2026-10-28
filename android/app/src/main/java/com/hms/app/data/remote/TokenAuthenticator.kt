package com.hms.app.data.remote

import com.hms.app.data.local.TokenStore
import com.hms.app.data.remote.api.AuthApi
import com.hms.app.data.remote.dto.RefreshTokenRequestDto
import kotlinx.coroutines.runBlocking
import okhttp3.Authenticator
import okhttp3.Request
import okhttp3.Response
import okhttp3.Route
import javax.inject.Inject
import javax.inject.Provider

class TokenAuthenticator @Inject constructor(
    private val tokenStore: TokenStore,
    private val authApiProvider: Provider<AuthApi>
) : Authenticator {

    override fun authenticate(route: Route?, response: Response): Request? {
        val refreshToken = tokenStore.getRefreshToken() ?: return null

        if (responseCount(response) >= 2) {
            return null
        }

        return synchronized(this) {
            val currentToken = tokenStore.getAccessToken()
            val requestToken = response.request.header("Authorization")?.replace("Bearer ", "")

            if (currentToken != null && currentToken != requestToken) {
                return@synchronized response.request.newBuilder()
                    .header("Authorization", "Bearer $currentToken")
                    .build()
            }

            val refreshResponse = runBlocking {
                try {
                    authApiProvider.get().refreshToken(RefreshTokenRequestDto(refreshToken))
                } catch (e: Exception) {
                    null
                }
            }

            if (refreshResponse != null && refreshResponse.isSuccessful) {
                val newTokens = refreshResponse.body()
                if (newTokens != null) {
                    tokenStore.saveTokens(newTokens.accessToken, newTokens.refreshToken)
                    return@synchronized response.request.newBuilder()
                        .header("Authorization", "Bearer ${newTokens.accessToken}")
                        .build()
                }
            }

            tokenStore.clear()
            null
        }
    }

    private fun responseCount(response: Response): Int {
        var result = 1
        var curr = response.priorResponse
        while (curr != null) {
            result++
            curr = curr.priorResponse
        }
        return result
    }
}
