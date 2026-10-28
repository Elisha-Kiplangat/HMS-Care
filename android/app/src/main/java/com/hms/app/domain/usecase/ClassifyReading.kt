package com.hms.app.domain.usecase

import com.hms.app.domain.model.RiskLevel
import javax.inject.Inject

class ClassifyReading @Inject constructor() {
    operator fun invoke(valueMmol: Double): RiskLevel {
        return when {
            valueMmol < 3.9 -> RiskLevel.LOW
            valueMmol <= 10.0 -> RiskLevel.IN_RANGE
            valueMmol <= 13.9 -> RiskLevel.HIGH
            else -> RiskLevel.VERY_HIGH
        }
    }
}
