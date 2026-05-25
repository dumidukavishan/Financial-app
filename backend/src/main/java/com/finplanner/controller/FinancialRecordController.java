package com.finplanner.controller;

import com.finplanner.dto.FinancialRecordDTO;
import com.finplanner.entity.FinancialRecord;
import com.finplanner.entity.User;
import com.finplanner.service.FinancialRecordService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/records")
public class FinancialRecordController {

    private final FinancialRecordService recordService;

    public FinancialRecordController(FinancialRecordService recordService) {
        this.recordService = recordService;
    }

    @GetMapping
    public ResponseEntity<Page<FinancialRecordDTO>> getAll(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(recordService.getRecords(user.getId(),
                PageRequest.of(page, size, Sort.by("recordDate").descending())));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<FinancialRecordDTO>> getByDateRange(
            @AuthenticationPrincipal User user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(recordService.getRecordsByDateRange(user.getId(), start, end));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<FinancialRecordDTO>> getByCategory(
            @AuthenticationPrincipal User user, @PathVariable UUID categoryId) {
        return ResponseEntity.ok(recordService.getRecordsByCategory(user.getId(), categoryId));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<FinancialRecordDTO>> getByType(
            @AuthenticationPrincipal User user, @PathVariable FinancialRecord.RecordType type) {
        return ResponseEntity.ok(recordService.getRecordsByType(user.getId(), type));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<FinancialRecordDTO>> getRecent(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(recordService.getRecentRecords(user.getId(), limit));
    }

    @PostMapping
    public ResponseEntity<FinancialRecordDTO> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody FinancialRecordDTO dto) {
        return ResponseEntity.ok(recordService.createRecord(user, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FinancialRecordDTO> update(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @Valid @RequestBody FinancialRecordDTO dto) {
        return ResponseEntity.ok(recordService.updateRecord(user.getId(), id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal User user, @PathVariable UUID id) {
        recordService.deleteRecord(user.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
