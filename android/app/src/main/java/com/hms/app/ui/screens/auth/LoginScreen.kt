package com.hms.app.ui.screens.auth

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.hms.app.ui.components.ErrorBanner
import com.hms.app.ui.components.HmsButton
import com.hms.app.ui.components.HmsTextField
import com.hms.app.ui.theme.TealPrimary

@Composable
fun LoginScreen(
    onLoginSuccess: () -> Unit,
    viewModel: LoginViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(uiState.isSuccess) {
        if (uiState.isSuccess) {
            onLoginSuccess()
        }
    }

    Scaffold { padding ->
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(24.dp)
        ) {
            Spacer(modifier = Modifier.height(48.dp))
            Text(
                text = "HMS Kenya",
                style = MaterialTheme.typography.displayLarge,
                color = TealPrimary
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Embu Level Five Hospital",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
            )

            Spacer(modifier = Modifier.height(48.dp))

            if (uiState.error != null) {
                ErrorBanner(message = uiState.error!!)
                Spacer(modifier = Modifier.height(16.dp))
            }

            HmsTextField(
                value = uiState.email,
                onValueChange = viewModel::onEmailChange,
                label = "Email",
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
            )

            Spacer(modifier = Modifier.height(16.dp))

            HmsTextField(
                value = uiState.pass,
                onValueChange = viewModel::onPasswordChange,
                label = "Password",
                visualTransformation = PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password)
            )

            Spacer(modifier = Modifier.height(24.dp))

            HmsButton(
                text = if (uiState.isLoading) "Logging in..." else "Log In",
                onClick = viewModel::login,
                enabled = !uiState.isLoading
            )
        }
    }
}
