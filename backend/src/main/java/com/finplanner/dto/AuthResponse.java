package com.finplanner.dto;

import java.util.UUID;

public class AuthResponse {
    private String token;
    private String refreshToken;
    private UUID userId;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private String currency;
    private String theme;

    public AuthResponse() {
    }

    public AuthResponse(String token, String refreshToken, UUID userId, String username, String email, String fullName, String role, String currency, String theme) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.currency = currency;
        this.theme = theme;
    }

    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    public static class AuthResponseBuilder {
        private String token;
        private String refreshToken;
        private UUID userId;
        private String username;
        private String email;
        private String fullName;
        private String role;
        private String currency;
        private String theme;

        public AuthResponseBuilder token(String token) { this.token = token; return this; }
        public AuthResponseBuilder refreshToken(String refreshToken) { this.refreshToken = refreshToken; return this; }
        public AuthResponseBuilder userId(UUID userId) { this.userId = userId; return this; }
        public AuthResponseBuilder username(String username) { this.username = username; return this; }
        public AuthResponseBuilder email(String email) { this.email = email; return this; }
        public AuthResponseBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public AuthResponseBuilder role(String role) { this.role = role; return this; }
        public AuthResponseBuilder currency(String currency) { this.currency = currency; return this; }
        public AuthResponseBuilder theme(String theme) { this.theme = theme; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, refreshToken, userId, username, email, fullName, role, currency, theme);
        }
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
}
