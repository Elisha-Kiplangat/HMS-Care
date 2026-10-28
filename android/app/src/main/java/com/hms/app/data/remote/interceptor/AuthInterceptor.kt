package com.hms.app.data.remote.interceptor

import com.hms.app.data.local.TokenStore
import okhttp3.Interceptor
import okhttp3.Response
import javax.inject.Inject

class AuthInterceptor @Inject constructor(
    private val tokenStore: TokenStore
) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val requestBuilder = chain.request().newBuilder()

        val token = tokenStore.getAccessToken()
        if (!token.isNull_or_empty()) {
            requestBuilder.addHeader("Authorization", "Bearer $token")
        }

        return chain.proceed(requestBuilder.build())
    }
}

private fun String?.isNull_or_empty(): Boolean = this == null || this.isEmpty()
