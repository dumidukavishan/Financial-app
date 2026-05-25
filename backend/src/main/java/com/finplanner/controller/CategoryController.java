package com.finplanner.controller;

import com.finplanner.dto.CategoryDTO;
import com.finplanner.entity.Category;
import com.finplanner.entity.User;
import com.finplanner.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(categoryService.getAllCategories(user.getId()));
    }

    @GetMapping("/root")
    public ResponseEntity<List<CategoryDTO>> getRoot(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(categoryService.getRootCategories(user.getId()));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<CategoryDTO>> getByType(@AuthenticationPrincipal User user,
                                                        @PathVariable Category.CategoryType type) {
        return ResponseEntity.ok(categoryService.getCategoriesByType(user.getId(), type));
    }

    @GetMapping("/{id}/subcategories")
    public ResponseEntity<List<CategoryDTO>> getSubcategories(@AuthenticationPrincipal User user,
                                                               @PathVariable UUID id) {
        return ResponseEntity.ok(categoryService.getSubCategories(user.getId(), id));
    }

    @PostMapping
    public ResponseEntity<CategoryDTO> create(@AuthenticationPrincipal User user,
                                               @Valid @RequestBody CategoryDTO dto) {
        return ResponseEntity.ok(categoryService.createCategory(user, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDTO> update(@AuthenticationPrincipal User user,
                                               @PathVariable UUID id,
                                               @Valid @RequestBody CategoryDTO dto) {
        return ResponseEntity.ok(categoryService.updateCategory(user.getId(), id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        categoryService.deleteCategory(user.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
