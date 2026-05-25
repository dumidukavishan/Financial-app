package com.finplanner.dto;

import com.finplanner.entity.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class CategoryDTO {
    private UUID id;

    @NotBlank
    private String name;

    private String icon;
    private String color;

    @NotNull
    private Category.CategoryType type;

    private UUID parentId;
    private String parentName;
    private String description;
    private Integer sortOrder;

    public CategoryDTO() {
    }

    public CategoryDTO(UUID id, String name, String icon, String color, Category.CategoryType type, UUID parentId, String parentName, String description, Integer sortOrder) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.color = color;
        this.type = type;
        this.parentId = parentId;
        this.parentName = parentName;
        this.description = description;
        this.sortOrder = sortOrder;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public Category.CategoryType getType() { return type; }
    public void setType(Category.CategoryType type) { this.type = type; }
    public UUID getParentId() { return parentId; }
    public void setParentId(UUID parentId) { this.parentId = parentId; }
    public String getParentName() { return parentName; }
    public void setParentName(String parentName) { this.parentName = parentName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
}
