package com.hms.app.data.remote.interceptor

import com.hms.app.data.local.TokenStore
import okhttp3.Interceptor
import okhttp3.Response
import javax.inject.Inject

class TenantInterceptor @Inject constructor(
    private val tokenStore: TokenStore
) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val requestBuilder = chain.request().newBuilder()

        val tenantId = tokenStore.getUser()?.tenantId
        if (!tenantId.isNullOrEmpty()) {
            requestBuilder.addHeader("X-Tenant-ID", tenantId)
        }

        return chain.proceed(requestBuilder.build())
    }
}
