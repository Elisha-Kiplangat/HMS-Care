package com.hms.app.di

import com.hms.app.BuildConfig
import com.hms.app.data.remote.TokenAuthenticator
import com.hms.app.data.remote.api.AppointmentApi
import com.hms.app.data.remote.api.AuthApi
import com.hms.app.data.remote.api.GlucoseApi
import com.hms.app.data.remote.api.Hba1cApi
import com.hms.app.data.remote.api.MedicationApi
import com.hms.app.data.remote.api.RefillApi
import com.hms.app.data.remote.api.TelemedicineApi
import com.hms.app.data.remote.interceptor.AuthInterceptor
import com.hms.app.data.remote.interceptor.TenantInterceptor
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.kotlinx.serialization.asConverterFactory
import java.util.concurrent.TimeUnit
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideJson(): Json = Json {
        ignoreUnknownKeys = true
        coerceInputValues = true
    }

    @Provides
    @Singleton
    fun provideOkHttpClient(
        authInterceptor: AuthInterceptor,
        tenantInterceptor: TenantInterceptor,
        authenticator: TokenAuthenticator
    ): OkHttpClient {
        val logging = HttpLoggingInterceptor().apply {
            level = if (BuildConfig.DEBUG) HttpLoggingInterceptor.Level.BODY else HttpLoggingInterceptor.Level.NONE
        }

        return OkHttpClient.Builder()
            .addInterceptor(authInterceptor)
            .addInterceptor(tenantInterceptor)
            .addInterceptor(logging)
            .authenticator(authenticator)
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build()
    }

    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient, json: Json): Retrofit {
        val contentType = "application/json".toMediaType()
        return Retrofit.Builder()
            .baseUrl(BuildConfig.API_BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(json.asConverterFactory(contentType))
            .build()
    }

    @Provides
    @Singleton
    fun provideAuthApi(retrofit: Retrofit): AuthApi = retrofit.create(AuthApi::class.java)

    @Provides
    @Singleton
    fun provideGlucoseApi(retrofit: Retrofit): GlucoseApi = retrofit.create(GlucoseApi::class.java)

    @Provides
    @Singleton
    fun provideHba1cApi(retrofit: Retrofit): Hba1cApi = retrofit.create(Hba1cApi::class.java)

    @Provides
    @Singleton
    fun provideMedicationApi(retrofit: Retrofit): MedicationApi = retrofit.create(MedicationApi::class.java)

    @Provides
    @Singleton
    fun provideRefillApi(retrofit: Retrofit): RefillApi = retrofit.create(RefillApi::class.java)

    @Provides
    @Singleton
    fun provideAppointmentApi(retrofit: Retrofit): AppointmentApi = retrofit.create(AppointmentApi::class.java)

    @Provides
    @Singleton
    fun provideTelemedicineApi(retrofit: Retrofit): TelemedicineApi = retrofit.create(TelemedicineApi::class.java)
}
