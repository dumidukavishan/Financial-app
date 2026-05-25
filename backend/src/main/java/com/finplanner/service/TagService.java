package com.finplanner.service;

import com.finplanner.dto.TagDTO;
import com.finplanner.entity.Tag;
import com.finplanner.entity.User;
import com.finplanner.repository.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TagService {

    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    public List<TagDTO> getAllTags(UUID userId) {
        return tagRepository.findByUserIdAndDeletedFalseOrderByNameAsc(userId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public TagDTO createTag(User user, TagDTO dto) {
        Tag tag = Tag.builder()
                .user(user)
                .name(dto.getName())
                .color(dto.getColor())
                .build();
        return toDTO(tagRepository.save(tag));
    }

    @Transactional
    public TagDTO updateTag(UUID userId, UUID tagId, TagDTO dto) {
        Tag tag = tagRepository.findByIdAndUserId(tagId, userId)
                .orElseThrow(() -> new RuntimeException("Tag not found"));
        tag.setName(dto.getName());
        tag.setColor(dto.getColor());
        return toDTO(tagRepository.save(tag));
    }

    @Transactional
    public void deleteTag(UUID userId, UUID tagId) {
        Tag tag = tagRepository.findByIdAndUserId(tagId, userId)
                .orElseThrow(() -> new RuntimeException("Tag not found"));
        tag.setDeleted(true);
        tagRepository.save(tag);
    }

    private TagDTO toDTO(Tag tag) {
        TagDTO dto = new TagDTO();
        dto.setId(tag.getId());
        dto.setName(tag.getName());
        dto.setColor(tag.getColor());
        return dto;
    }
}
