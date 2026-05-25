package com.finplanner.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

@Service
public class CurrencyService {

    // System is LKR-only. No external currency conversion needed.
    private static final String BASE_CURRENCY = "LKR";

    public Map<String, BigDecimal> getRates() {
        // Only LKR is supported system-wide
        return Map.of("LKR", BigDecimal.ONE);
    }

    /**
     * Convert an amount between currencies.
     * Since the system is LKR-only, all records are already in LKR.
     * This returns the amount unchanged regardless of currency params.
     */
    public BigDecimal convert(BigDecimal amount, String fromCurrency, String toCurrency) {
        if (amount == null) return BigDecimal.ZERO;
        // System is LKR-only — no conversion needed
        return amount;
    }
}
