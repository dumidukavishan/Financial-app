package com.finplanner.controller;

import com.finplanner.dto.AuthResponse;
import com.finplanner.dto.LoginRequest;
import com.finplanner.dto.RegisterRequest;
import com.finplanner.entity.User;
import com.finplanner.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(authService.refreshToken(body.get("refreshToken")));
    }

    @PutMapping("/profile")
    public ResponseEntity<AuthResponse> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body) {
        String fullName = body.get("fullName");
        String currency = body.get("currency");
        String theme = body.get("theme");

        User updatedUser = authService.updateProfile(user.getId(), fullName, currency, theme);

        AuthResponse response = AuthResponse.builder()
                .userId(updatedUser.getId())
                .username(updatedUser.getUsername())
                .email(updatedUser.getEmail())
                .fullName(updatedUser.getFullName())
                .role(updatedUser.getRole().name())
                .currency(updatedUser.getCurrency())
                .theme(updatedUser.getTheme())
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "ok"));
    }
}
