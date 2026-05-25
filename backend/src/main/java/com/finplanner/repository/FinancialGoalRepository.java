package com.finplanner.repository;

import com.finplanner.entity.FinancialGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FinancialGoalRepository extends JpaRepository<FinancialGoal, UUID> {
    List<FinancialGoal> findByUserIdAndDeletedFalseOrderByCreatedAtDesc(UUID userId);
    Optional<FinancialGoal> findByIdAndUserId(UUID id, UUID userId);
    List<FinancialGoal> findByUserIdAndStatusAndDeletedFalse(UUID userId, FinancialGoal.GoalStatus status);
}
