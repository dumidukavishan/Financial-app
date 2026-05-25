package com.finplanner.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 50)
    private String icon;

    @Column(length = 7)
    private String color;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategoryType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    private boolean deleted = false;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum CategoryType {
        INCOME, EXPENSE, SAVINGS, INVESTMENT, LOAN, ASSET, LIABILITY,
        PAWNING, SUBSCRIPTION, BILL, DEBT, GOAL, CUSTOM
    }

    public Category() {
    }

    public Category(UUID id, User user, String name, String icon, String color, CategoryType type, Category parent, String description, Integer sortOrder, boolean deleted) {
        this.id = id;
        this.user = user;
        this.name = name;
        this.icon = icon;
        this.color = color;
        this.type = type;
        this.parent = parent;
        this.description = description;
        this.sortOrder = sortOrder != null ? sortOrder : 0;
        this.deleted = deleted;
    }

    public static CategoryBuilder builder() {
        return new CategoryBuilder();
    }

    public static class CategoryBuilder {
        private UUID id;
        private User user;
        private String name;
        private String icon;
        private String color;
        private CategoryType type;
        private Category parent;
        private String description;
        private Integer sortOrder = 0;
        private boolean deleted = false;

        public CategoryBuilder id(UUID id) { this.id = id; return this; }
        public CategoryBuilder user(User user) { this.user = user; return this; }
        public CategoryBuilder name(String name) { this.name = name; return this; }
        public CategoryBuilder icon(String icon) { this.icon = icon; return this; }
        public CategoryBuilder color(String color) { this.color = color; return this; }
        public CategoryBuilder type(CategoryType type) { this.type = type; return this; }
        public CategoryBuilder parent(Category parent) { this.parent = parent; return this; }
        public CategoryBuilder description(String description) { this.description = description; return this; }
        public CategoryBuilder sortOrder(Integer sortOrder) { this.sortOrder = sortOrder; return this; }
        public CategoryBuilder deleted(boolean deleted) { this.deleted = deleted; return this; }

        public Category build() {
            return new Category(id, user, name, icon, color, type, parent, description, sortOrder, deleted);
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
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public CategoryType getType() { return type; }
    public void setType(CategoryType type) { this.type = type; }
    public Category getParent() { return parent; }
    public void setParent(Category parent) { this.parent = parent; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
