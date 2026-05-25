package com.finplanner.service;

import com.finplanner.dto.FinancialRecordDTO;
import com.finplanner.dto.TagDTO;
import com.finplanner.entity.*;
import com.finplanner.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FinancialRecordService {

    private final FinancialRecordRepository recordRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;

    public FinancialRecordService(FinancialRecordRepository recordRepository, CategoryRepository categoryRepository, TagRepository tagRepository) {
        this.recordRepository = recordRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
    }

    public Page<FinancialRecordDTO> getRecords(UUID userId, Pageable pageable) {
        return recordRepository.findByUserIdAndDeletedFalseOrderByRecordDateDesc(userId, pageable)
                .map(this::toDTO);
    }

    public List<FinancialRecordDTO> getRecordsByDateRange(UUID userId, LocalDate start, LocalDate end) {
        return recordRepository.findByUserIdAndDeletedFalseAndRecordDateBetweenOrderByRecordDateDesc(userId, start, end)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<FinancialRecordDTO> getRecordsByCategory(UUID userId, UUID categoryId) {
        return recordRepository.findByUserIdAndCategoryIdAndDeletedFalseOrderByRecordDateDesc(userId, categoryId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<FinancialRecordDTO> getRecordsByType(UUID userId, FinancialRecord.RecordType type) {
        return recordRepository.findByUserIdAndTypeAndDeletedFalseOrderByRecordDateDesc(userId, type)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<FinancialRecordDTO> getRecentRecords(UUID userId, int limit) {
        return recordRepository.findRecentByUserId(userId, PageRequest.of(0, limit))
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public FinancialRecordDTO createRecord(User user, FinancialRecordDTO dto) {
        FinancialRecord record = FinancialRecord.builder()
                .user(user)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .amount(dto.getAmount())
                .type(dto.getType())
                .recordDate(dto.getRecordDate())
                .notes(dto.getNotes())
                .status(dto.getStatus() != null ? dto.getStatus() : FinancialRecord.RecordStatus.ACTIVE)
                .reminderDate(dto.getReminderDate())
                .currency(dto.getCurrency() != null ? dto.getCurrency() : user.getCurrency())
                .recurring(dto.isRecurring())
                .recurrencePattern(dto.getRecurrencePattern())
                .build();

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findByIdAndUserId(dto.getCategoryId(), user.getId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            record.setCategory(category);
        }

        if (dto.getTagIds() != null && !dto.getTagIds().isEmpty()) {
            Set<Tag> tags = new HashSet<>();
            for (UUID tagId : dto.getTagIds()) {
                Tag tag = tagRepository.findByIdAndUserId(tagId, user.getId())
                        .orElseThrow(() -> new RuntimeException("Tag not found: " + tagId));
                tags.add(tag);
            }
            record.setTags(tags);
        }

        return toDTO(recordRepository.save(record));
    }

    @Transactional
    public FinancialRecordDTO updateRecord(UUID userId, UUID recordId, FinancialRecordDTO dto) {
        FinancialRecord record = recordRepository.findByIdAndUserId(recordId, userId)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        record.setTitle(dto.getTitle());
        record.setDescription(dto.getDescription());
        record.setAmount(dto.getAmount());
        record.setType(dto.getType());
        record.setRecordDate(dto.getRecordDate());
        record.setNotes(dto.getNotes());
        if (dto.getStatus() != null) record.setStatus(dto.getStatus());
        record.setReminderDate(dto.getReminderDate());
        if (dto.getCurrency() != null) record.setCurrency(dto.getCurrency());
        record.setRecurring(dto.isRecurring());
        record.setRecurrencePattern(dto.getRecurrencePattern());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findByIdAndUserId(dto.getCategoryId(), userId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            record.setCategory(category);
        } else {
            record.setCategory(null);
        }

        if (dto.getTagIds() != null) {
            Set<Tag> tags = new HashSet<>();
            for (UUID tagId : dto.getTagIds()) {
                Tag tag = tagRepository.findByIdAndUserId(tagId, userId)
                        .orElseThrow(() -> new RuntimeException("Tag not found: " + tagId));
                tags.add(tag);
            }
            record.setTags(tags);
        }

        return toDTO(recordRepository.save(record));
    }

    @Transactional
    public void deleteRecord(UUID userId, UUID recordId) {
        FinancialRecord record = recordRepository.findByIdAndUserId(recordId, userId)
                .orElseThrow(() -> new RuntimeException("Record not found"));
        record.setDeleted(true);
        recordRepository.save(record);
    }

    private FinancialRecordDTO toDTO(FinancialRecord record) {
        FinancialRecordDTO dto = new FinancialRecordDTO();
        dto.setId(record.getId());
        dto.setTitle(record.getTitle());
        dto.setDescription(record.getDescription());
        dto.setAmount(record.getAmount());
        dto.setType(record.getType());
        dto.setRecordDate(record.getRecordDate());
        dto.setNotes(record.getNotes());
        dto.setStatus(record.getStatus());
        dto.setReminderDate(record.getReminderDate());
        dto.setCurrency(record.getCurrency());
        dto.setRecurring(record.isRecurring());
        dto.setRecurrencePattern(record.getRecurrencePattern());
        dto.setCreatedAt(record.getCreatedAt() != null ? record.getCreatedAt().toString() : null);

        if (record.getCategory() != null) {
            dto.setCategoryId(record.getCategory().getId());
            dto.setCategoryName(record.getCategory().getName());
            dto.setCategoryColor(record.getCategory().getColor());
            dto.setCategoryIcon(record.getCategory().getIcon());
        }

        if (record.getTags() != null) {
            dto.setTags(record.getTags().stream().map(tag -> {
                TagDTO tagDTO = new TagDTO();
                tagDTO.setId(tag.getId());
                tagDTO.setName(tag.getName());
                tagDTO.setColor(tag.getColor());
                return tagDTO;
            }).collect(Collectors.toSet()));
        }

        return dto;
    }
}
