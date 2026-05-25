package com.finplanner.controller;

import com.finplanner.dto.FinancialGoalDTO;
import com.finplanner.entity.User;
import com.finplanner.service.FinancialGoalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final FinancialGoalService goalService;

    public GoalController(FinancialGoalService goalService) {
        this.goalService = goalService;
    }

    @GetMapping
    public ResponseEntity<List<FinancialGoalDTO>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(goalService.getAllGoals(user.getId()));
    }

    @GetMapping("/active")
    public ResponseEntity<List<FinancialGoalDTO>> getActive(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(goalService.getActiveGoals(user.getId()));
    }

    @PostMapping
    public ResponseEntity<FinancialGoalDTO> create(@AuthenticationPrincipal User user,
                                                    @Valid @RequestBody FinancialGoalDTO dto) {
        return ResponseEntity.ok(goalService.createGoal(user, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FinancialGoalDTO> update(@AuthenticationPrincipal User user,
                                                    @PathVariable UUID id,
                                                    @Valid @RequestBody FinancialGoalDTO dto) {
        return ResponseEntity.ok(goalService.updateGoal(user.getId(), id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        goalService.deleteGoal(user.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
