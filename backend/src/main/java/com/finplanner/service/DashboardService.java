package com.finplanner.service;

import com.finplanner.dto.DashboardDTO;
import com.finplanner.dto.FinancialGoalDTO;
import com.finplanner.dto.FinancialRecordDTO;
import com.finplanner.entity.FinancialRecord;
import com.finplanner.entity.User;
import com.finplanner.repository.FinancialRecordRepository;
import com.finplanner.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
public class DashboardService {

    private final FinancialRecordRepository recordRepository;
    private final UserRepository userRepository;
    private final FinancialRecordService recordService;
    private final FinancialGoalService goalService;
    private final CurrencyService currencyService;

    public DashboardService(FinancialRecordRepository recordRepository, 
                            UserRepository userRepository,
                            FinancialRecordService recordService, 
                            FinancialGoalService goalService,
                            CurrencyService currencyService) {
        this.recordRepository = recordRepository;
        this.userRepository = userRepository;
        this.recordService = recordService;
        this.goalService = goalService;
        this.currencyService = currencyService;
    }

    public DashboardDTO getDashboard(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String userCurrency = user.getCurrency() != null ? user.getCurrency() : "LKR";

        LocalDate now = LocalDate.now();
        LocalDate monthStart = now.withDayOfMonth(1);
        LocalDate monthEnd = now.withDayOfMonth(now.lengthOfMonth());
        LocalDate yearStart = now.withDayOfYear(1);

        // Fetch all active records for the user
        List<FinancialRecord> allRecords = recordRepository.findByUserIdAndDeletedFalse(userId);

        // All-time totals in User's preferred currency
        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpenses = BigDecimal.ZERO;
        BigDecimal totalSavings = BigDecimal.ZERO;
        BigDecimal totalInvestments = BigDecimal.ZERO;
        BigDecimal totalLoans = BigDecimal.ZERO;

        // Monthly totals in User's preferred currency
        BigDecimal monthlyIncome = BigDecimal.ZERO;
        BigDecimal monthlyExpenses = BigDecimal.ZERO;
        BigDecimal monthlySavings = BigDecimal.ZERO;

        // Group net balance by source currency
        Map<String, BigDecimal> currencyNetBalanceMap = new HashMap<>();

        for (FinancialRecord record : allRecords) {
            BigDecimal recordAmt = record.getAmount();
            if (recordAmt == null) continue;

            String recordCurrency = record.getCurrency() != null ? record.getCurrency().toUpperCase() : "LKR";

            // Add/subtract for source currency breakdown
            if (record.getType() == FinancialRecord.RecordType.INCOME) {
                currencyNetBalanceMap.put(recordCurrency, currencyNetBalanceMap.getOrDefault(recordCurrency, BigDecimal.ZERO).add(recordAmt));
            } else if (record.getType() == FinancialRecord.RecordType.EXPENSE) {
                currencyNetBalanceMap.put(recordCurrency, currencyNetBalanceMap.getOrDefault(recordCurrency, BigDecimal.ZERO).subtract(recordAmt));
            }

            // Convert amount to user's preferred currency for aggregations
            BigDecimal convertedAmount = currencyService.convert(recordAmt, recordCurrency, userCurrency);

            // Sum all-time totals
            switch (record.getType()) {
                case INCOME -> totalIncome = totalIncome.add(convertedAmount);
                case EXPENSE -> totalExpenses = totalExpenses.add(convertedAmount);
                case SAVINGS -> totalSavings = totalSavings.add(convertedAmount);
                case INVESTMENT -> totalInvestments = totalInvestments.add(convertedAmount);
                case LOAN_RECEIVED -> totalLoans = totalLoans.add(convertedAmount);
            }

            // Sum monthly totals
            LocalDate recordDate = record.getRecordDate();
            if (recordDate != null && !recordDate.isBefore(monthStart) && !recordDate.isAfter(monthEnd)) {
                switch (record.getType()) {
                    case INCOME -> monthlyIncome = monthlyIncome.add(convertedAmount);
                    case EXPENSE -> monthlyExpenses = monthlyExpenses.add(convertedAmount);
                    case SAVINGS -> monthlySavings = monthlySavings.add(convertedAmount);
                }
            }
        }

        BigDecimal netBalance = totalIncome.subtract(totalExpenses);

        // Recent transactions (10)
        List<FinancialRecordDTO> recentTransactions = recordService.getRecentRecords(userId, 10);

        // Active goals
        List<FinancialGoalDTO> activeGoals = goalService.getActiveGoals(userId);

        // Monthly trends (last 6 months) converted to User's preferred currency
        LocalDate sixMonthsAgo = now.minusMonths(5).withDayOfMonth(1); // 6 months inclusive of current
        List<Map<String, Object>> monthlyTrends = new ArrayList<>();
        Map<String, Map<String, BigDecimal>> trendMap = new LinkedHashMap<>();

        // Initialize months
        for (int i = 5; i >= 0; i--) {
            LocalDate d = now.minusMonths(i);
            String monthKey = d.getYear() + "-" + String.format("%02d", d.getMonthValue());
            Map<String, BigDecimal> typeMap = new HashMap<>();
            typeMap.put("INCOME", BigDecimal.ZERO);
            typeMap.put("EXPENSE", BigDecimal.ZERO);
            typeMap.put("SAVINGS", BigDecimal.ZERO);
            trendMap.put(monthKey, typeMap);
        }

        for (FinancialRecord record : allRecords) {
            LocalDate rDate = record.getRecordDate();
            if (rDate != null && !rDate.isBefore(sixMonthsAgo) && !rDate.isAfter(monthEnd)) {
                String monthKey = rDate.getYear() + "-" + String.format("%02d", rDate.getMonthValue());
                if (trendMap.containsKey(monthKey)) {
                    BigDecimal converted = currencyService.convert(record.getAmount(), record.getCurrency(), userCurrency);
                    String typeStr = record.getType().name();
                    Map<String, BigDecimal> monthData = trendMap.get(monthKey);
                    if (monthData.containsKey(typeStr)) {
                        monthData.put(typeStr, monthData.get(typeStr).add(converted));
                    }
                }
            }
        }

        for (Map.Entry<String, Map<String, BigDecimal>> entry : trendMap.entrySet()) {
            Map<String, Object> trendItem = new HashMap<>();
            trendItem.put("month", entry.getKey());
            trendItem.put("INCOME", entry.getValue().get("INCOME"));
            trendItem.put("EXPENSE", entry.getValue().get("EXPENSE"));
            trendItem.put("SAVINGS", entry.getValue().get("SAVINGS"));
            monthlyTrends.add(trendItem);
        }

        // Expense breakdown by category (converted to User's currency)
        Map<String, BigDecimal> expCatMap = new HashMap<>();
        Map<String, BigDecimal> incCatMap = new HashMap<>();

        for (FinancialRecord record : allRecords) {
            LocalDate rDate = record.getRecordDate();
            if (rDate != null && !rDate.isBefore(yearStart) && !rDate.isAfter(monthEnd)) {
                if (record.getCategory() != null) {
                    String catName = record.getCategory().getName();
                    BigDecimal converted = currencyService.convert(record.getAmount(), record.getCurrency(), userCurrency);
                    if (record.getType() == FinancialRecord.RecordType.EXPENSE) {
                        expCatMap.put(catName, expCatMap.getOrDefault(catName, BigDecimal.ZERO).add(converted));
                    } else if (record.getType() == FinancialRecord.RecordType.INCOME) {
                        incCatMap.put(catName, incCatMap.getOrDefault(catName, BigDecimal.ZERO).add(converted));
                    }
                }
            }
        }

        List<Map<String, Object>> expensesByCategory = new ArrayList<>();
        for (Map.Entry<String, BigDecimal> entry : expCatMap.entrySet()) {
            expensesByCategory.add(Map.of("category", entry.getKey(), "amount", entry.getValue()));
        }
        expensesByCategory.sort((a, b) -> ((BigDecimal) b.get("amount")).compareTo((BigDecimal) a.get("amount")));

        List<Map<String, Object>> incomeByCategory = new ArrayList<>();
        for (Map.Entry<String, BigDecimal> entry : incCatMap.entrySet()) {
            incomeByCategory.add(Map.of("category", entry.getKey(), "amount", entry.getValue()));
        }
        incomeByCategory.sort((a, b) -> ((BigDecimal) b.get("amount")).compareTo((BigDecimal) a.get("amount")));

        // Summary by type
        Map<String, BigDecimal> summaryByType = new HashMap<>();
        summaryByType.put("INCOME", totalIncome);
        summaryByType.put("EXPENSE", totalExpenses);
        summaryByType.put("SAVINGS", totalSavings);
        summaryByType.put("INVESTMENT", totalInvestments);
        summaryByType.put("LOAN_RECEIVED", totalLoans);

        // Build currency breakdown details
        List<Map<String, Object>> currencyBreakdown = new ArrayList<>();
        for (Map.Entry<String, BigDecimal> entry : currencyNetBalanceMap.entrySet()) {
            String cur = entry.getKey();
            BigDecimal originalAmount = entry.getValue();
            BigDecimal lkrAmount = currencyService.convert(originalAmount, cur, "LKR");

            Map<String, Object> item = new HashMap<>();
            item.put("currency", "LKR");
            item.put("amount", lkrAmount);
            item.put("lkrAmount", lkrAmount);
            item.put("country", "Sri Lanka");
            item.put("flag", "🇱🇰");
            currencyBreakdown.add(item);
        }

        return DashboardDTO.builder()
                .totalIncome(totalIncome)
                .totalExpenses(totalExpenses)
                .totalSavings(totalSavings)
                .totalInvestments(totalInvestments)
                .totalLoans(totalLoans)
                .netBalance(netBalance)
                .monthlyIncome(monthlyIncome)
                .monthlyExpenses(monthlyExpenses)
                .monthlySavings(monthlySavings)
                .recentTransactions(recentTransactions)
                .activeGoals(activeGoals)
                .monthlyTrends(monthlyTrends)
                .expensesByCategory(expensesByCategory)
                .incomeByCategory(incomeByCategory)
                .summaryByType(summaryByType)
                .currencyBreakdown(currencyBreakdown)
                .build();
    }
}
