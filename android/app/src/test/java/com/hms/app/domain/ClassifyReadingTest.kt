package com.hms.app.domain

import com.hms.app.domain.model.RiskLevel
import com.hms.app.domain.usecase.ClassifyReading
import com.hms.app.util.GlucoseUnits
import org.junit.Assert.assertEquals
import org.junit.Test

class ClassifyReadingTest {

    private val classifyReading = ClassifyReading()

    @Test
    fun classifyLowGlucose_returnsLowRiskLevel() {
        val result = classifyReading(3.2)
        assertEquals(RiskLevel.LOW, result)
    }

    @Test
    fun classifyInRangeGlucose_returnsInRangeRiskLevel() {
        val result = classifyReading(6.8)
        assertEquals(RiskLevel.IN_RANGE, result)
    }

    @Test
    fun classifyHighGlucose_returnsHighRiskLevel() {
        val result = classifyReading(12.5)
        assertEquals(RiskLevel.HIGH, result)
    }

    @Test
    fun classifyVeryHighGlucose_returnsVeryHighRiskLevel() {
        val result = classifyReading(15.2)
        assertEquals(RiskLevel.VERY_HIGH, result)
    }

    @Test
    fun testGlucoseUnitConversions() {
        val mmol = 10.0
        val mgDl = GlucoseUnits.mmolToMgDl(mmol)
        assertEquals(180.16, mgDl, 0.01)

        val backToMmol = GlucoseUnits.mgDlToMmol(mgDl)
        assertEquals(mmol, backToMmol, 0.01)
    }
}
