package com.finplanner.controller;

import com.finplanner.dto.TagDTO;
import com.finplanner.entity.User;
import com.finplanner.service.TagService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public ResponseEntity<List<TagDTO>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(tagService.getAllTags(user.getId()));
    }

    @PostMapping
    public ResponseEntity<TagDTO> create(@AuthenticationPrincipal User user,
                                          @Valid @RequestBody TagDTO dto) {
        return ResponseEntity.ok(tagService.createTag(user, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TagDTO> update(@AuthenticationPrincipal User user,
                                          @PathVariable UUID id,
                                          @Valid @RequestBody TagDTO dto) {
        return ResponseEntity.ok(tagService.updateTag(user.getId(), id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        tagService.deleteTag(user.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
