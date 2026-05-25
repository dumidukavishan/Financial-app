package com.finplanner.service;

import com.finplanner.dto.FinancialGoalDTO;
import com.finplanner.entity.Category;
import com.finplanner.entity.FinancialGoal;
import com.finplanner.entity.User;
import com.finplanner.repository.CategoryRepository;
import com.finplanner.repository.FinancialGoalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FinancialGoalService {

    private final FinancialGoalRepository goalRepository;
    private final CategoryRepository categoryRepository;

    public FinancialGoalService(FinancialGoalRepository goalRepository, CategoryRepository categoryRepository) {
        this.goalRepository = goalRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<FinancialGoalDTO> getAllGoals(UUID userId) {
        return goalRepository.findByUserIdAndDeletedFalseOrderByCreatedAtDesc(userId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<FinancialGoalDTO> getActiveGoals(UUID userId) {
        return goalRepository.findByUserIdAndStatusAndDeletedFalse(userId, FinancialGoal.GoalStatus.IN_PROGRESS)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public FinancialGoalDTO createGoal(User user, FinancialGoalDTO dto) {
        FinancialGoal goal = FinancialGoal.builder()
                .user(user)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .targetAmount(dto.getTargetAmount())
                .currentAmount(dto.getCurrentAmount() != null ? dto.getCurrentAmount() : java.math.BigDecimal.ZERO)
                .deadline(dto.getDeadline())
                .color(dto.getColor())
                .icon(dto.getIcon())
                .build();

        if (dto.getCategoryId() != null) {
            Category cat = categoryRepository.findByIdAndUserId(dto.getCategoryId(), user.getId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            goal.setCategory(cat);
        }

        return toDTO(goalRepository.save(goal));
    }

    @Transactional
    public FinancialGoalDTO updateGoal(UUID userId, UUID goalId, FinancialGoalDTO dto) {
        FinancialGoal goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        goal.setTitle(dto.getTitle());
        goal.setDescription(dto.getDescription());
        goal.setTargetAmount(dto.getTargetAmount());
        if (dto.getCurrentAmount() != null) goal.setCurrentAmount(dto.getCurrentAmount());
        goal.setDeadline(dto.getDeadline());
        goal.setColor(dto.getColor());
        goal.setIcon(dto.getIcon());
        if (dto.getStatus() != null) goal.setStatus(dto.getStatus());

        return toDTO(goalRepository.save(goal));
    }

    @Transactional
    public void deleteGoal(UUID userId, UUID goalId) {
        FinancialGoal goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        goal.setDeleted(true);
        goalRepository.save(goal);
    }

    private FinancialGoalDTO toDTO(FinancialGoal goal) {
        FinancialGoalDTO dto = new FinancialGoalDTO();
        dto.setId(goal.getId());
        dto.setTitle(goal.getTitle());
        dto.setDescription(goal.getDescription());
        dto.setTargetAmount(goal.getTargetAmount());
        dto.setCurrentAmount(goal.getCurrentAmount());
        dto.setProgressPercentage(goal.getProgressPercentage());
        dto.setDeadline(goal.getDeadline());
        dto.setColor(goal.getColor());
        dto.setIcon(goal.getIcon());
        dto.setStatus(goal.getStatus());
        if (goal.getCategory() != null) {
            dto.setCategoryId(goal.getCategory().getId());
            dto.setCategoryName(goal.getCategory().getName());
        }
        return dto;
    }
}
