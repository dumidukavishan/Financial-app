package com.finplanner.repository;

import com.finplanner.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
    List<Category> findByUserIdAndDeletedFalseOrderBySortOrderAsc(UUID userId);
    List<Category> findByUserIdAndTypeAndDeletedFalse(UUID userId, Category.CategoryType type);
    List<Category> findByUserIdAndParentIdAndDeletedFalse(UUID userId, UUID parentId);
    Optional<Category> findByIdAndUserId(UUID id, UUID userId);
    List<Category> findByUserIdAndParentIsNullAndDeletedFalseOrderBySortOrderAsc(UUID userId);
}
