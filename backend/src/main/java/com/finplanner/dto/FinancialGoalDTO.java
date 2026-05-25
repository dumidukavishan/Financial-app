package com.finplanner.dto;

import com.finplanner.entity.FinancialGoal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public class FinancialGoalDTO {
    private UUID id;

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private BigDecimal targetAmount;

    private BigDecimal currentAmount;
    private BigDecimal progressPercentage;
    private LocalDate deadline;
    private String color;
    private String icon;
    private UUID categoryId;
    private String categoryName;
    private FinancialGoal.GoalStatus status;

    public FinancialGoalDTO() {
    }

    public FinancialGoalDTO(UUID id, String title, String description, BigDecimal targetAmount, BigDecimal currentAmount, BigDecimal progressPercentage, LocalDate deadline, String color, String icon, UUID categoryId, String categoryName, FinancialGoal.GoalStatus status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.targetAmount = targetAmount;
        this.currentAmount = currentAmount;
        this.progressPercentage = progressPercentage;
        this.deadline = deadline;
        this.color = color;
        this.icon = icon;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.status = status;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getTargetAmount() { return targetAmount; }
    public void setTargetAmount(BigDecimal targetAmount) { this.targetAmount = targetAmount; }
    public BigDecimal getCurrentAmount() { return currentAmount; }
    public void setCurrentAmount(BigDecimal currentAmount) { this.currentAmount = currentAmount; }
    public BigDecimal getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(BigDecimal progressPercentage) { this.progressPercentage = progressPercentage; }
    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public UUID getCategoryId() { return categoryId; }
    public void setCategoryId(UUID categoryId) { this.categoryId = categoryId; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public FinancialGoal.GoalStatus getStatus() { return status; }
    public void setStatus(FinancialGoal.GoalStatus status) { this.status = status; }
}
