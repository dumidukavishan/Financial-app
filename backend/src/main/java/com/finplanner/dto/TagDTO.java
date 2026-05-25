package com.finplanner.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public class TagDTO {
    private UUID id;

    @NotBlank
    private String name;

    private String color;

    public TagDTO() {
    }

    public TagDTO(UUID id, String name, String color) {
        this.id = id;
        this.name = name;
        this.color = color;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}
