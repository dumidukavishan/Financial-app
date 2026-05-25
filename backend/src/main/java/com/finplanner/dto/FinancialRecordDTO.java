package com.finplanner.dto;

import com.finplanner.entity.FinancialRecord;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

public class FinancialRecordDTO {
    private UUID id;

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private BigDecimal amount;

    @NotNull
    private FinancialRecord.RecordType type;

    private UUID categoryId;
    private String categoryName;
    private String categoryColor;
    private String categoryIcon;

    @NotNull
    private LocalDate recordDate;

    private String notes;
    private FinancialRecord.RecordStatus status;
    private LocalDate reminderDate;
    private String currency;
    private boolean recurring;
    private String recurrencePattern;
    private Set<UUID> tagIds;
    private Set<TagDTO> tags;
    private String createdAt;

    public FinancialRecordDTO() {
    }

    public FinancialRecordDTO(UUID id, String title, String description, BigDecimal amount, FinancialRecord.RecordType type, UUID categoryId, String categoryName, String categoryColor, String categoryIcon, LocalDate recordDate, String notes, FinancialRecord.RecordStatus status, LocalDate reminderDate, String currency, boolean recurring, String recurrencePattern, Set<UUID> tagIds, Set<TagDTO> tags, String createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.amount = amount;
        this.type = type;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.categoryColor = categoryColor;
        this.categoryIcon = categoryIcon;
        this.recordDate = recordDate;
        this.notes = notes;
        this.status = status;
        this.reminderDate = reminderDate;
        this.currency = currency;
        this.recurring = recurring;
        this.recurrencePattern = recurrencePattern;
        this.tagIds = tagIds;
        this.tags = tags;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public FinancialRecord.RecordType getType() { return type; }
    public void setType(FinancialRecord.RecordType type) { this.type = type; }
    public UUID getCategoryId() { return categoryId; }
    public void setCategoryId(UUID categoryId) { this.categoryId = categoryId; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public String getCategoryColor() { return categoryColor; }
    public void setCategoryColor(String categoryColor) { this.categoryColor = categoryColor; }
    public String getCategoryIcon() { return categoryIcon; }
    public void setCategoryIcon(String categoryIcon) { this.categoryIcon = categoryIcon; }
    public LocalDate getRecordDate() { return recordDate; }
    public void setRecordDate(LocalDate recordDate) { this.recordDate = recordDate; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public FinancialRecord.RecordStatus getStatus() { return status; }
    public void setStatus(FinancialRecord.RecordStatus status) { this.status = status; }
    public LocalDate getReminderDate() { return reminderDate; }
    public void setReminderDate(LocalDate reminderDate) { this.reminderDate = reminderDate; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public boolean isRecurring() { return recurring; }
    public void setRecurring(boolean recurring) { this.recurring = recurring; }
    public String getRecurrencePattern() { return recurrencePattern; }
    public void setRecurrencePattern(String recurrencePattern) { this.recurrencePattern = recurrencePattern; }
    public Set<UUID> getTagIds() { return tagIds; }
    public void setTagIds(Set<UUID> tagIds) { this.tagIds = tagIds; }
    public Set<TagDTO> getTags() { return tags; }
    public void setTags(Set<TagDTO> tags) { this.tags = tags; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
