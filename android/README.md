# HMS Android App

Native Android app (Kotlin) for **patients**: log blood glucose, track HbA1c, see medications, get reminders and join video or audio consultations. It is built for low-end devices and unreliable networks, so **offline-first**.

> **Status: scaffold.** Folders and empty files are in place. Implementation starts in Phase 2 (see the [root roadmap](../README.md#18-roadmap)).

## Stack

- **Kotlin** and **Jetpack Compose** (Material 3)
- **MVVM** with clean architecture (data, domain, ui)
- **Hilt** for dependency injection
- **Retrofit** and **OkHttp** for networking, Kotlin serialization (or Moshi) for JSON
- **Room** for local storage
- **WorkManager** for background sync and reminders
- **Firebase Cloud Messaging** for push notifications
- **WebRTC** for calls, with Socket.IO signalling
- Coroutines and Flow, Navigation Compose
- JUnit, MockK, Turbine, Compose UI tests

## Targets

- `minSdk 26` (Android 8.0), to cover the budget devices common in Kenya
- `targetSdk` and `compileSdk`: latest stable
- Package: `com.hms.app`

## Structure

```
android/
├── settings.gradle.kts  build.gradle.kts  gradle.properties
├── gradle/libs.versions.toml            version catalog
└── app/
    ├── build.gradle.kts  proguard-rules.pro
    ├── google-services.json.example     real file is git-ignored
    └── src/
        ├── main/
        │   ├── AndroidManifest.xml
        │   ├── res/                     strings (en, sw), colors, themes, xml configs
        │   └── java/com/hms/app/
        │       ├── HmsApplication.kt  MainActivity.kt
        │       ├── data/
        │       │   ├── local/           HmsDatabase, TokenStore, dao/, entity/
        │       │   ├── remote/          api/, dto/, interceptor/, TokenAuthenticator
        │       │   ├── repository/      repository implementations
        │       │   └── mapper/          DTO, entity and domain mappers
        │       ├── domain/
        │       │   ├── model/           User, GlucoseReading, Hba1cResult, Medication ...
        │       │   ├── repository/      repository interfaces
        │       │   └── usecase/         LogGlucoseReading, ClassifyReading, JoinCall ...
        │       ├── ui/
        │       │   ├── theme/           Color, Type, Shape, Theme
        │       │   ├── components/      HmsButton, HmsCard, GlucoseValueChip, TrendChart ...
        │       │   ├── navigation/      Routes, HmsNavGraph
        │       │   └── screens/         auth, home, glucose, hba1c, medications,
        │       │                        refills, appointments, call, profile
        │       ├── di/                  Hilt modules
        │       ├── work/                sync and reminder workers
        │       ├── notifications/       FCM service, channels, helper
        │       ├── telemedicine/        SignalingClient, WebRtcClient, CallManager
        │       └── util/                Resource, date utils, glucose units, network monitor
        ├── test/                        unit tests
        └── androidTest/                 instrumented and UI tests
```

## Architecture

```
 UI (Compose screens) ──► ViewModel ──► Use cases ──► Repository interface
                                                           │
                                         ┌─────────────────┴─────────────────┐
                                         ▼                                   ▼
                                   Room (local)                       Retrofit (remote)
```

- The **UI** is stateless and driven by `UiState` exposed from ViewModels as `StateFlow`
- **Use cases** hold business rules, for example `ClassifyReading` (low, in range, high)
- **Repositories** are the single source of truth. The UI reads from Room, and the network refreshes Room

## Offline-first glucose logging

1. A new reading is saved to Room immediately and the UI updates at once
2. The reading is added to a **sync queue** (`SyncQueueEntity`)
3. `GlucoseSyncWorker` (WorkManager) uploads queued readings when a network is available, with exponential backoff
4. Each reading has a client-generated ID, so retries never create duplicates
5. The server response confirms the reading and marks it synced

The user is never blocked by a missing connection. A small, unobtrusive "will sync when online" indicator is shown.

## Multi-tenancy on the client

The login response carries the hospital (tenant) and role. `TenantInterceptor` and `AuthInterceptor` attach the access token. `TokenAuthenticator` refreshes expired tokens. Tokens are stored in encrypted storage via `TokenStore`.

## Notifications and reminders

| Type | Mechanism |
|---|---|
| Medication dose | Local scheduled notification (`MedicationReminderWorker`) |
| Refill (Embu Level 5 Pharmacy) | Push from server and `RefillReminderWorker` |
| Appointment | Push and `AppointmentReminderWorker` |

Notification channels (in `NotificationChannels.kt`): medication, refill, appointments, calls. Users can mute each channel.

## Telemedicine

- `SignalingClient` exchanges offer, answer and ICE with the backend `/signaling` namespace
- `WebRtcClient` and `CallManager` manage the peer connection and media
- `NetworkQualityMonitor` measures the connection. On a weak network the call starts or switches to **audio-only**
- `PreCallScreen` checks camera, microphone and network. `VideoCallScreen` and `AudioCallScreen` are the in-call UIs

## UI and design

The same principles and tokens as the web app (see the [root README](../README.md#13-uiux-design-principles)):

- Clean, minimal, one primary action per screen, large "Log glucose" call to action
- Teal primary (`#0F766E`), soft neutral surfaces, Inter or system font, 12dp corner radius
- Large touch targets (48dp or more), large numeric keypad for glucose entry
- Glucose status always uses colour **and** icon **and** text
- Light and dark themes, dynamic type, TalkBack labels
- English and Kiswahili (`values/strings.xml`, `values-sw/strings.xml`)
- Bottom navigation: Home, Log, Meds, Visits

## Build and run

1. Install Android Studio (latest stable) and JDK 17+
2. Open the `android/` folder
3. Add your Firebase `google-services.json` to `app/` (use `google-services.json.example` as a guide; the real file is git-ignored)
4. Set the API base URL in `app/build.gradle.kts` build config fields (debug points at `http://10.0.2.2:3000/api/v1` for the emulator)
5. Run the `app` configuration on an emulator or device

```bash
./gradlew assembleDebug
./gradlew test                  # unit tests
./gradlew connectedAndroidTest  # instrumented tests
```

## Security

- Tokens in encrypted storage; no secrets in the repo
- HTTPS only in release builds (`network_security_config.xml`)
- Backup rules exclude tokens and local health data (`backup_rules.xml`, `data_extraction_rules.xml`)
- R8 minification and obfuscation enabled for release
- Optional app lock (PIN or biometric)
- Release signing keys are never committed

## Testing

- **Unit:** `ClassifyReading`, unit conversion, repository logic, ViewModels
- **UI:** Compose tests for logging a reading, including the offline path
- **Worker:** sync and reminder workers with `TestListenableWorkerBuilder`

## Conventions

- Kotlin official code style, with ktlint and detekt in CI
- No business logic in composables
- Every screen has loading, empty and error states
- All strings are in resources, never hard-coded
