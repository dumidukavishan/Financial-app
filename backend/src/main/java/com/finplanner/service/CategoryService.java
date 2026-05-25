package com.finplanner.service;

import com.finplanner.dto.CategoryDTO;
import com.finplanner.entity.Category;
import com.finplanner.entity.User;
import com.finplanner.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDTO> getAllCategories(UUID userId) {
        return categoryRepository.findByUserIdAndDeletedFalseOrderBySortOrderAsc(userId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<CategoryDTO> getRootCategories(UUID userId) {
        return categoryRepository.findByUserIdAndParentIsNullAndDeletedFalseOrderBySortOrderAsc(userId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<CategoryDTO> getSubCategories(UUID userId, UUID parentId) {
        return categoryRepository.findByUserIdAndParentIdAndDeletedFalse(userId, parentId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<CategoryDTO> getCategoriesByType(UUID userId, Category.CategoryType type) {
        return categoryRepository.findByUserIdAndTypeAndDeletedFalse(userId, type)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public CategoryDTO createCategory(User user, CategoryDTO dto) {
        Category category = Category.builder()
                .user(user)
                .name(dto.getName())
                .icon(dto.getIcon())
                .color(dto.getColor())
                .type(dto.getType())
                .description(dto.getDescription())
                .sortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0)
                .build();

        if (dto.getParentId() != null) {
            Category parent = categoryRepository.findByIdAndUserId(dto.getParentId(), user.getId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));
            category.setParent(parent);
        }

        return toDTO(categoryRepository.save(category));
    }

    @Transactional
    public CategoryDTO updateCategory(UUID userId, UUID categoryId, CategoryDTO dto) {
        Category category = categoryRepository.findByIdAndUserId(categoryId, userId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(dto.getName());
        category.setIcon(dto.getIcon());
        category.setColor(dto.getColor());
        category.setType(dto.getType());
        category.setDescription(dto.getDescription());
        if (dto.getSortOrder() != null) category.setSortOrder(dto.getSortOrder());

        if (dto.getParentId() != null) {
            Category parent = categoryRepository.findByIdAndUserId(dto.getParentId(), userId)
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));
            category.setParent(parent);
        } else {
            category.setParent(null);
        }

        return toDTO(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(UUID userId, UUID categoryId) {
        Category category = categoryRepository.findByIdAndUserId(categoryId, userId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setDeleted(true);
        categoryRepository.save(category);
    }

    private CategoryDTO toDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setIcon(category.getIcon());
        dto.setColor(category.getColor());
        dto.setType(category.getType());
        dto.setDescription(category.getDescription());
        dto.setSortOrder(category.getSortOrder());
        if (category.getParent() != null) {
            dto.setParentId(category.getParent().getId());
            dto.setParentName(category.getParent().getName());
        }
        return dto;
    }
}
