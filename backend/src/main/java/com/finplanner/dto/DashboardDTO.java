package com.finplanner.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardDTO {
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal totalSavings;
    private BigDecimal totalInvestments;
    private BigDecimal totalLoans;
    private BigDecimal netBalance;

    private BigDecimal monthlyIncome;
    private BigDecimal monthlyExpenses;
    private BigDecimal monthlySavings;

    private List<FinancialRecordDTO> recentTransactions;
    private List<FinancialGoalDTO> activeGoals;

    private List<Map<String, Object>> monthlyTrends;
    private List<Map<String, Object>> expensesByCategory;
    private List<Map<String, Object>> incomeByCategory;

    private Map<String, BigDecimal> summaryByType;
    private List<Map<String, Object>> currencyBreakdown;

    public DashboardDTO() {
    }

    public DashboardDTO(BigDecimal totalIncome, BigDecimal totalExpenses, BigDecimal totalSavings, BigDecimal totalInvestments, BigDecimal totalLoans, BigDecimal netBalance, BigDecimal monthlyIncome, BigDecimal monthlyExpenses, BigDecimal monthlySavings, List<FinancialRecordDTO> recentTransactions, List<FinancialGoalDTO> activeGoals, List<Map<String, Object>> monthlyTrends, List<Map<String, Object>> expensesByCategory, List<Map<String, Object>> incomeByCategory, Map<String, BigDecimal> summaryByType, List<Map<String, Object>> currencyBreakdown) {
        this.totalIncome = totalIncome;
        this.totalExpenses = totalExpenses;
        this.totalSavings = totalSavings;
        this.totalInvestments = totalInvestments;
        this.totalLoans = totalLoans;
        this.netBalance = netBalance;
        this.monthlyIncome = monthlyIncome;
        this.monthlyExpenses = monthlyExpenses;
        this.monthlySavings = monthlySavings;
        this.recentTransactions = recentTransactions;
        this.activeGoals = activeGoals;
        this.monthlyTrends = monthlyTrends;
        this.expensesByCategory = expensesByCategory;
        this.incomeByCategory = incomeByCategory;
        this.summaryByType = summaryByType;
        this.currencyBreakdown = currencyBreakdown;
    }

    public static DashboardDTOBuilder builder() {
        return new DashboardDTOBuilder();
    }

    public static class DashboardDTOBuilder {
        private BigDecimal totalIncome;
        private BigDecimal totalExpenses;
        private BigDecimal totalSavings;
        private BigDecimal totalInvestments;
        private BigDecimal totalLoans;
        private BigDecimal netBalance;
        private BigDecimal monthlyIncome;
        private BigDecimal monthlyExpenses;
        private BigDecimal monthlySavings;
        private List<FinancialRecordDTO> recentTransactions;
        private List<FinancialGoalDTO> activeGoals;
        private List<Map<String, Object>> monthlyTrends;
        private List<Map<String, Object>> expensesByCategory;
        private List<Map<String, Object>> incomeByCategory;
        private Map<String, BigDecimal> summaryByType;
        private List<Map<String, Object>> currencyBreakdown;

        public DashboardDTOBuilder totalIncome(BigDecimal totalIncome) { this.totalIncome = totalIncome; return this; }
        public DashboardDTOBuilder totalExpenses(BigDecimal totalExpenses) { this.totalExpenses = totalExpenses; return this; }
        public DashboardDTOBuilder totalSavings(BigDecimal totalSavings) { this.totalSavings = totalSavings; return this; }
        public DashboardDTOBuilder totalInvestments(BigDecimal totalInvestments) { this.totalInvestments = totalInvestments; return this; }
        public DashboardDTOBuilder totalLoans(BigDecimal totalLoans) { this.totalLoans = totalLoans; return this; }
        public DashboardDTOBuilder netBalance(BigDecimal netBalance) { this.netBalance = netBalance; return this; }
        public DashboardDTOBuilder monthlyIncome(BigDecimal monthlyIncome) { this.monthlyIncome = monthlyIncome; return this; }
        public DashboardDTOBuilder monthlyExpenses(BigDecimal monthlyExpenses) { this.monthlyExpenses = monthlyExpenses; return this; }
        public DashboardDTOBuilder monthlySavings(BigDecimal monthlySavings) { this.monthlySavings = monthlySavings; return this; }
        public DashboardDTOBuilder recentTransactions(List<FinancialRecordDTO> recentTransactions) { this.recentTransactions = recentTransactions; return this; }
        public DashboardDTOBuilder activeGoals(List<FinancialGoalDTO> activeGoals) { this.activeGoals = activeGoals; return this; }
        public DashboardDTOBuilder monthlyTrends(List<Map<String, Object>> monthlyTrends) { this.monthlyTrends = monthlyTrends; return this; }
        public DashboardDTOBuilder expensesByCategory(List<Map<String, Object>> expensesByCategory) { this.expensesByCategory = expensesByCategory; return this; }
        public DashboardDTOBuilder incomeByCategory(List<Map<String, Object>> incomeByCategory) { this.incomeByCategory = incomeByCategory; return this; }
        public DashboardDTOBuilder summaryByType(Map<String, BigDecimal> summaryByType) { this.summaryByType = summaryByType; return this; }
        public DashboardDTOBuilder currencyBreakdown(List<Map<String, Object>> currencyBreakdown) { this.currencyBreakdown = currencyBreakdown; return this; }

        public DashboardDTO build() {
            return new DashboardDTO(totalIncome, totalExpenses, totalSavings, totalInvestments, totalLoans, netBalance, monthlyIncome, monthlyExpenses, monthlySavings, recentTransactions, activeGoals, monthlyTrends, expensesByCategory, incomeByCategory, summaryByType, currencyBreakdown);
        }
    }

    // Getters and Setters
    public BigDecimal getTotalIncome() { return totalIncome; }
    public void setTotalIncome(BigDecimal totalIncome) { this.totalIncome = totalIncome; }
    public BigDecimal getTotalExpenses() { return totalExpenses; }
    public void setTotalExpenses(BigDecimal totalExpenses) { this.totalExpenses = totalExpenses; }
    public BigDecimal getTotalSavings() { return totalSavings; }
    public void setTotalSavings(BigDecimal totalSavings) { this.totalSavings = totalSavings; }
    public BigDecimal getTotalInvestments() { return totalInvestments; }
    public void setTotalInvestments(BigDecimal totalInvestments) { this.totalInvestments = totalInvestments; }
    public BigDecimal getTotalLoans() { return totalLoans; }
    public void setTotalLoans(BigDecimal totalLoans) { this.totalLoans = totalLoans; }
    public BigDecimal getNetBalance() { return netBalance; }
    public void setNetBalance(BigDecimal netBalance) { this.netBalance = netBalance; }
    public BigDecimal getMonthlyIncome() { return monthlyIncome; }
    public void setMonthlyIncome(BigDecimal monthlyIncome) { this.monthlyIncome = monthlyIncome; }
    public BigDecimal getMonthlyExpenses() { return monthlyExpenses; }
    public void setMonthlyExpenses(BigDecimal monthlyExpenses) { this.monthlyExpenses = monthlyExpenses; }
    public BigDecimal getMonthlySavings() { return monthlySavings; }
    public void setMonthlySavings(BigDecimal monthlySavings) { this.monthlySavings = monthlySavings; }
    public List<FinancialRecordDTO> getRecentTransactions() { return recentTransactions; }
    public void setRecentTransactions(List<FinancialRecordDTO> recentTransactions) { this.recentTransactions = recentTransactions; }
    public List<FinancialGoalDTO> getActiveGoals() { return activeGoals; }
    public void setActiveGoals(List<FinancialGoalDTO> activeGoals) { this.activeGoals = activeGoals; }
    public List<Map<String, Object>> getMonthlyTrends() { return monthlyTrends; }
    public void setMonthlyTrends(List<Map<String, Object>> monthlyTrends) { this.monthlyTrends = monthlyTrends; }
    public List<Map<String, Object>> getExpensesByCategory() { return expensesByCategory; }
    public void setExpensesByCategory(List<Map<String, Object>> expensesByCategory) { this.expensesByCategory = expensesByCategory; }
    public List<Map<String, Object>> getIncomeByCategory() { return incomeByCategory; }
    public void setIncomeByCategory(List<Map<String, Object>> incomeByCategory) { this.incomeByCategory = incomeByCategory; }
    public Map<String, BigDecimal> getSummaryByType() { return summaryByType; }
    public void setSummaryByType(Map<String, BigDecimal> summaryByType) { this.summaryByType = summaryByType; }
    public List<Map<String, Object>> getCurrencyBreakdown() { return currencyBreakdown; }
    public void setCurrencyBreakdown(List<Map<String, Object>> currencyBreakdown) { this.currencyBreakdown = currencyBreakdown; }
}
