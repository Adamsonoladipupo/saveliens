package com.saveliens.saveliens.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreateTopicResponseDto {
    private String id;
    private String userId;
    private String title;
    private String description;
    private LocalDateTime createdAt;
}
