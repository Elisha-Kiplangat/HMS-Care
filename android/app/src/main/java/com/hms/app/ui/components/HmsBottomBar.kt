package com.hms.app.ui.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AddCircle
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Medication
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.res.stringResource
import com.hms.app.R
import com.hms.app.ui.navigation.Routes
import com.hms.app.ui.theme.TealPrimary

@Composable
fun HmsBottomBar(
    currentRoute: String?,
    onNavigate: (String) -> Unit
) {
    val items = listOf(
        Triple(Routes.HOME, R.string.nav_home, Icons.Default.Home),
        Triple(Routes.LOG_GLUCOSE, R.string.nav_log, Icons.Default.AddCircle),
        Triple(Routes.MEDICATIONS, R.string.nav_meds, Icons.Default.Medication),
        Triple(Routes.APPOINTMENTS, R.string.nav_visits, Icons.Default.DateRange)
    )

    NavigationBar(
        containerColor = MaterialTheme.colorScheme.surface
    ) {
        items.forEach { (route, labelRes, icon) ->
            val isSelected = currentRoute == route
            NavigationBarItem(
                selected = isSelected,
                onClick = { onNavigate(route) },
                icon = { Icon(icon, contentDescription = stringResource(labelRes)) },
                label = { Text(stringResource(labelRes)) },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = TealPrimary,
                    selectedTextColor = TealPrimary,
                    indicatorColor = TealPrimary.copy(alpha = 0.1f)
                )
            )
        }
    }
}
