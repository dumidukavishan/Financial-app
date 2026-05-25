package com.finplanner.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tags")
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(length = 7)
    private String color;

    private boolean deleted = false;

    private LocalDateTime createdAt;

    public Tag() {
    }

    public Tag(UUID id, User user, String name, String color, boolean deleted) {
        this.id = id;
        this.user = user;
        this.name = name;
        this.color = color;
        this.deleted = deleted;
    }

    public static TagBuilder builder() {
        return new TagBuilder();
    }

    public static class TagBuilder {
        private UUID id;
        private User user;
        private String name;
        private String color;
        private boolean deleted = false;

        public TagBuilder id(UUID id) { this.id = id; return this; }
        public TagBuilder user(User user) { this.user = user; return this; }
        public TagBuilder name(String name) { this.name = name; return this; }
        public TagBuilder color(String color) { this.color = color; return this; }
        public TagBuilder deleted(boolean deleted) { this.deleted = deleted; return this; }

        public Tag build() {
            return new Tag(id, user, name, color, deleted);
        }
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
