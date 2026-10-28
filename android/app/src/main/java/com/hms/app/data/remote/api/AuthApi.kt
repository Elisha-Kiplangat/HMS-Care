package com.hms.app.data.remote.api

import com.hms.app.data.remote.dto.AcceptInvitationRequestDto
import com.hms.app.data.remote.dto.LoginRequestDto
import com.hms.app.data.remote.dto.LoginResponseDto
import com.hms.app.data.remote.dto.MessageResponseDto
import com.hms.app.data.remote.dto.RefreshTokenRequestDto
import com.hms.app.data.remote.dto.TokenRefreshResponseDto
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApi {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequestDto): Response<LoginResponseDto>

    @POST("auth/refresh")
    suspend fun refreshToken(@Body request: RefreshTokenRequestDto): Response<TokenRefreshResponseDto>

    @POST("auth/logout")
    suspend fun logout(): Response<MessageResponseDto>

    @POST("auth/accept-invitation")
    suspend fun acceptInvitation(@Body request: AcceptInvitationRequestDto): Response<MessageResponseDto>
}
