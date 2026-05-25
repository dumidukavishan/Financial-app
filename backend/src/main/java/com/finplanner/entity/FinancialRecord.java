package com.finplanner.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "financial_records")
public class FinancialRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecordType type;

    @Column(nullable = false)
    private LocalDate recordDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    private RecordStatus status = RecordStatus.ACTIVE;

    private LocalDate reminderDate;

    @Column(length = 10)
    private String currency = "LKR";

    private boolean recurring = false;

    @Column(length = 20)
    private String recurrencePattern;

    private boolean deleted = false;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "record_tags",
        joinColumns = @JoinColumn(name = "record_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum RecordType {
        INCOME, EXPENSE, TRANSFER, SAVINGS, INVESTMENT, LOAN_PAYMENT,
        LOAN_RECEIVED, PAWNING, SUBSCRIPTION, BILL, DEBT, CUSTOM
    }

    public enum RecordStatus {
        ACTIVE, COMPLETED, PENDING, CANCELLED, OVERDUE
    }

    public FinancialRecord() {
    }

    public FinancialRecord(UUID id, User user, Category category, String title, String description, BigDecimal amount, RecordType type, LocalDate recordDate, String notes, RecordStatus status, LocalDate reminderDate, String currency, boolean recurring, String recurrencePattern, boolean deleted, Set<Tag> tags) {
        this.id = id;
        this.user = user;
        this.category = category;
        this.title = title;
        this.description = description;
        this.amount = amount;
        this.type = type;
        this.recordDate = recordDate;
        this.notes = notes;
        this.status = status != null ? status : RecordStatus.ACTIVE;
        this.reminderDate = reminderDate;
        this.currency = currency != null ? currency : "LKR";
        this.recurring = recurring;
        this.recurrencePattern = recurrencePattern;
        this.deleted = deleted;
        this.tags = tags != null ? tags : new HashSet<>();
    }

    public static FinancialRecordBuilder builder() {
        return new FinancialRecordBuilder();
    }

    public static class FinancialRecordBuilder {
        private UUID id;
        private User user;
        private Category category;
        private String title;
        private String description;
        private BigDecimal amount;
        private RecordType type;
        private LocalDate recordDate;
        private String notes;
        private RecordStatus status = RecordStatus.ACTIVE;
        private LocalDate reminderDate;
        private String currency = "LKR";
        private boolean recurring = false;
        private String recurrencePattern;
        private boolean deleted = false;
        private Set<Tag> tags = new HashSet<>();

        public FinancialRecordBuilder id(UUID id) { this.id = id; return this; }
        public FinancialRecordBuilder user(User user) { this.user = user; return this; }
        public FinancialRecordBuilder category(Category category) { this.category = category; return this; }
        public FinancialRecordBuilder title(String title) { this.title = title; return this; }
        public FinancialRecordBuilder description(String description) { this.description = description; return this; }
        public FinancialRecordBuilder amount(BigDecimal amount) { this.amount = amount; return this; }
        public FinancialRecordBuilder type(RecordType type) { this.type = type; return this; }
        public FinancialRecordBuilder recordDate(LocalDate recordDate) { this.recordDate = recordDate; return this; }
        public FinancialRecordBuilder notes(String notes) { this.notes = notes; return this; }
        public FinancialRecordBuilder status(RecordStatus status) { this.status = status; return this; }
        public FinancialRecordBuilder reminderDate(LocalDate reminderDate) { this.reminderDate = reminderDate; return this; }
        public FinancialRecordBuilder currency(String currency) { this.currency = currency; return this; }
        public FinancialRecordBuilder recurring(boolean recurring) { this.recurring = recurring; return this; }
        public FinancialRecordBuilder recurrencePattern(String recurrencePattern) { this.recurrencePattern = recurrencePattern; return this; }
        public FinancialRecordBuilder deleted(boolean deleted) { this.deleted = deleted; return this; }
        public FinancialRecordBuilder tags(Set<Tag> tags) { this.tags = tags; return this; }

        public FinancialRecord build() {
            return new FinancialRecord(id, user, category, title, description, amount, type, recordDate, notes, status, reminderDate, currency, recurring, recurrencePattern, deleted, tags);
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

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public RecordType getType() { return type; }
    public void setType(RecordType type) { this.type = type; }
    public LocalDate getRecordDate() { return recordDate; }
    public void setRecordDate(LocalDate recordDate) { this.recordDate = recordDate; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public RecordStatus getStatus() { return status; }
    public void setStatus(RecordStatus status) { this.status = status; }
    public LocalDate getReminderDate() { return reminderDate; }
    public void setReminderDate(LocalDate reminderDate) { this.reminderDate = reminderDate; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public boolean isRecurring() { return recurring; }
    public void setRecurring(boolean recurring) { this.recurring = recurring; }
    public String getRecurrencePattern() { return recurrencePattern; }
    public void setRecurrencePattern(String recurrencePattern) { this.recurrencePattern = recurrencePattern; }
    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
    public Set<Tag> getTags() { return tags; }
    public void setTags(Set<Tag> tags) { this.tags = tags; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
