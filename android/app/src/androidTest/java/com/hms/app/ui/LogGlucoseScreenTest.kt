package com.hms.app.ui

import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithText
import com.hms.app.ui.components.HmsButton
import com.hms.app.ui.theme.HmsTheme
import org.junit.Rule
import org.junit.Test

class LogGlucoseScreenTest {

    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun buttonRendersTextCorrectly() {
        composeTestRule.setContent {
            HmsTheme {
                HmsButton(text = "Log Glucose", onClick = {})
            }
        }

        composeTestRule.onNodeWithText("Log Glucose").assertExists()
    }
}
