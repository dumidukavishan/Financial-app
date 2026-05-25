package com.finplanner.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "financial_goals")
public class FinancialGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal targetAmount;

    @Column(precision = 15, scale = 2)
    private BigDecimal currentAmount = BigDecimal.ZERO;

    private LocalDate deadline;

    @Column(length = 7)
    private String color;

    @Column(length = 50)
    private String icon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Enumerated(EnumType.STRING)
    private GoalStatus status = GoalStatus.IN_PROGRESS;

    private boolean deleted = false;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum GoalStatus {
        IN_PROGRESS, COMPLETED, PAUSED, CANCELLED
    }

    public FinancialGoal() {
    }

    public FinancialGoal(UUID id, User user, String title, String description, BigDecimal targetAmount, BigDecimal currentAmount, LocalDate deadline, String color, String icon, Category category, GoalStatus status, boolean deleted) {
        this.id = id;
        this.user = user;
        this.title = title;
        this.description = description;
        this.targetAmount = targetAmount;
        this.currentAmount = currentAmount != null ? currentAmount : BigDecimal.ZERO;
        this.deadline = deadline;
        this.color = color;
        this.icon = icon;
        this.category = category;
        this.status = status != null ? status : GoalStatus.IN_PROGRESS;
        this.deleted = deleted;
    }

    public static FinancialGoalBuilder builder() {
        return new FinancialGoalBuilder();
    }

    public static class FinancialGoalBuilder {
        private UUID id;
        private User user;
        private String title;
        private String description;
        private BigDecimal targetAmount;
        private BigDecimal currentAmount = BigDecimal.ZERO;
        private LocalDate deadline;
        private String color;
        private String icon;
        private Category category;
        private GoalStatus status = GoalStatus.IN_PROGRESS;
        private boolean deleted = false;

        public FinancialGoalBuilder id(UUID id) { this.id = id; return this; }
        public FinancialGoalBuilder user(User user) { this.user = user; return this; }
        public FinancialGoalBuilder title(String title) { this.title = title; return this; }
        public FinancialGoalBuilder description(String description) { this.description = description; return this; }
        public FinancialGoalBuilder targetAmount(BigDecimal targetAmount) { this.targetAmount = targetAmount; return this; }
        public FinancialGoalBuilder currentAmount(BigDecimal currentAmount) { this.currentAmount = currentAmount; return this; }
        public FinancialGoalBuilder deadline(LocalDate deadline) { this.deadline = deadline; return this; }
        public FinancialGoalBuilder color(String color) { this.color = color; return this; }
        public FinancialGoalBuilder icon(String icon) { this.icon = icon; return this; }
        public FinancialGoalBuilder category(Category category) { this.category = category; return this; }
        public FinancialGoalBuilder status(GoalStatus status) { this.status = status; return this; }
        public FinancialGoalBuilder deleted(boolean deleted) { this.deleted = deleted; return this; }

        public FinancialGoal build() {
            return new FinancialGoal(id, user, title, description, targetAmount, currentAmount, deadline, color, icon, category, status, deleted);
        }
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public BigDecimal getProgressPercentage() {
        if (targetAmount == null || targetAmount.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return currentAmount.multiply(BigDecimal.valueOf(100))
                .divide(targetAmount, 2, java.math.RoundingMode.HALF_UP);
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getTargetAmount() { return targetAmount; }
    public void setTargetAmount(BigDecimal targetAmount) { this.targetAmount = targetAmount; }
    public BigDecimal getCurrentAmount() { return currentAmount; }
    public void setCurrentAmount(BigDecimal currentAmount) { this.currentAmount = currentAmount; }
    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public GoalStatus getStatus() { return status; }
    public void setStatus(GoalStatus status) { this.status = status; }
    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
