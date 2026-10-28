package com.hms.app.ui.screens.auth

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import com.hms.app.ui.components.HmsButton
import com.hms.app.ui.components.HmsTextField
import com.hms.app.ui.components.HmsTopBar

@Composable
fun AcceptInvitationScreen(
    onAccepted: () -> Unit,
    onBackClick: () -> Unit
) {
    var firstName by remember { mutableStateOf("") }
    var lastName by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

    Scaffold(
        topBar = { HmsTopBar(title = "Accept Invitation", onBackClick = onBackClick) }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
        ) {
            HmsTextField(
                value = firstName,
                onValueChange = { firstName = it },
                label = "First Name"
            )
            Spacer(modifier = Modifier.height(16.dp))
            HmsTextField(
                value = lastName,
                onValueChange = { lastName = it },
                label = "Last Name"
            )
            Spacer(modifier = Modifier.height(16.dp))
            HmsTextField(
                value = password,
                onValueChange = { password = it },
                label = "Create Password",
                visualTransformation = PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password)
            )
            Spacer(modifier = Modifier.height(24.dp))
            HmsButton(
                text = "Register Account",
                onClick = onAccepted
            )
        }
    }
}
