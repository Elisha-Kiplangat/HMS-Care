package com.hms.app.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.hms.app.data.local.TokenStore
import com.hms.app.ui.screens.appointments.AppointmentsScreen
import com.hms.app.ui.screens.auth.AcceptInvitationScreen
import com.hms.app.ui.screens.auth.LoginScreen
import com.hms.app.ui.screens.call.AudioCallScreen
import com.hms.app.ui.screens.call.PreCallScreen
import com.hms.app.ui.screens.call.VideoCallScreen
import com.hms.app.ui.screens.glucose.GlucoseHistoryScreen
import com.hms.app.ui.screens.glucose.LogGlucoseScreen
import com.hms.app.ui.screens.hba1c.Hba1cScreen
import com.hms.app.ui.screens.home.HomeScreen
import com.hms.app.ui.screens.medications.MedicationsScreen
import com.hms.app.ui.screens.profile.ProfileScreen
import com.hms.app.ui.screens.refills.RefillsScreen

@Composable
fun HmsNavGraph(
    tokenStore: TokenStore? = null,
    navController: NavHostController = rememberNavController()
) {
    val currentUser by (tokenStore?.currentUserFlow ?: kotlinx.coroutines.flow.MutableStateFlow(null)).collectAsState()
    val initialDestination = if (tokenStore?.getAccessToken() != null || currentUser != null) Routes.HOME else Routes.LOGIN

    NavHost(
        navController = navController,
        startDestination = initialDestination
    ) {
        composable(Routes.LOGIN) {
            LoginScreen(
                onLoginSuccess = {
                    navController.navigate(Routes.HOME) {
                        popUpTo(Routes.LOGIN) { inclusive = true }
                    }
                }
            )
        }

        composable(Routes.ACCEPT_INVITATION) {
            AcceptInvitationScreen(
                onAccepted = {
                    navController.navigate(Routes.HOME) {
                        popUpTo(Routes.ACCEPT_INVITATION) { inclusive = true }
                    }
                },
                onBackClick = { navController.popBackStack() }
            )
        }

        composable(Routes.HOME) {
            HomeScreen(
                onNavigate = { route -> navController.navigate(route) }
            )
        }

        composable(Routes.LOG_GLUCOSE) {
            LogGlucoseScreen(
                onNavigate = { route -> navController.navigate(route) },
                onSuccess = { navController.navigate(Routes.HOME) }
            )
        }

        composable(Routes.GLUCOSE_HISTORY) {
            GlucoseHistoryScreen(
                onBackClick = { navController.popBackStack() }
            )
        }

        composable(Routes.HBA1C) {
            Hba1cScreen(
                onBackClick = { navController.popBackStack() }
            )
        }

        composable(Routes.MEDICATIONS) {
            MedicationsScreen(
                onNavigate = { route -> navController.navigate(route) }
            )
        }

        composable(Routes.REFILLS) {
            RefillsScreen(
                onBackClick = { navController.popBackStack() }
            )
        }

        composable(Routes.APPOINTMENTS) {
            AppointmentsScreen(
                onNavigate = { route -> navController.navigate(route) }
            )
        }

        composable(Routes.PRE_CALL) { backStackEntry ->
            val apptId = backStackEntry.arguments?.getString("appointmentId") ?: ""
            PreCallScreen(
                appointmentId = apptId,
                onStartVideoCall = { navController.navigate(Routes.videoCall(apptId)) },
                onStartAudioCall = { navController.navigate(Routes.audioCall(apptId)) },
                onBackClick = { navController.popBackStack() }
            )
        }

        composable(Routes.VIDEO_CALL) { backStackEntry ->
            val apptId = backStackEntry.arguments?.getString("appointmentId") ?: ""
            VideoCallScreen(
                appointmentId = apptId,
                onEndCall = { navController.popBackStack(Routes.APPOINTMENTS, false) }
            )
        }

        composable(Routes.AUDIO_CALL) { backStackEntry ->
            val apptId = backStackEntry.arguments?.getString("appointmentId") ?: ""
            AudioCallScreen(
                appointmentId = apptId,
                onEndCall = { navController.popBackStack(Routes.APPOINTMENTS, false) }
            )
        }

        composable(Routes.PROFILE) {
            ProfileScreen(
                onLoggedOut = {
                    navController.navigate(Routes.LOGIN) {
                        popUpTo(0) { inclusive = true }
                    }
                },
                onBackClick = { navController.popBackStack() }
            )
        }
    }
}
