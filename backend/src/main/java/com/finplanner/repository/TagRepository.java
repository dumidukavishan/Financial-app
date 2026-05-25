package com.finplanner.repository;

import com.finplanner.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TagRepository extends JpaRepository<Tag, UUID> {
    List<Tag> findByUserIdAndDeletedFalseOrderByNameAsc(UUID userId);
    Optional<Tag> findByIdAndUserId(UUID id, UUID userId);
}
