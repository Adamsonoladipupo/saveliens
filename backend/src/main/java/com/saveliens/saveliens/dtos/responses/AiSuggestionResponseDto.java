package com.saveliens.saveliens.dtos.responses;

import com.saveliens.saveliens.ai.AiProvider.SuggestionType;

public record AiSuggestionResponseDto(
        SuggestionType type,
        String suggestedTopicId,
        String suggestedTopicName,
        String suggestedTopicDescription,
        String summary,
        String reason
) {}