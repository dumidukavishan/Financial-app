package com.finplanner.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(length = 100)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @Column(length = 10)
    private String currency = "LKR";

    @Column(length = 10)
    private String theme = "dark";

    @Column(length = 10)
    private String locale = "en";

    private boolean deleted = false;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum Role {
        USER, ADMIN
    }

    public User() {
    }

    public User(UUID id, String username, String email, String passwordHash, String fullName, Role role, String currency, String theme, String locale, boolean deleted) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.role = role;
        this.currency = currency;
        this.theme = theme;
        this.locale = locale;
        this.deleted = deleted;
    }

    // Custom Builder
    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private UUID id;
        private String username;
        private String email;
        private String passwordHash;
        private String fullName;
        private Role role = Role.USER;
        private String currency = "LKR";
        private String theme = "dark";
        private String locale = "en";
        private boolean deleted = false;

        public UserBuilder id(UUID id) { this.id = id; return this; }
        public UserBuilder username(String username) { this.username = username; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder passwordHash(String passwordHash) { this.passwordHash = passwordHash; return this; }
        public UserBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public UserBuilder role(Role role) { this.role = role; return this; }
        public UserBuilder currency(String currency) { this.currency = currency; return this; }
        public UserBuilder theme(String theme) { this.theme = theme; return this; }
        public UserBuilder locale(String locale) { this.locale = locale; return this; }
        public UserBuilder deleted(boolean deleted) { this.deleted = deleted; return this; }

        public User build() {
            return new User(id, username, email, passwordHash, fullName, role, currency, theme, locale, deleted);
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
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
    public String getLocale() { return locale; }
    public void setLocale(String locale) { this.locale = locale; }
    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
