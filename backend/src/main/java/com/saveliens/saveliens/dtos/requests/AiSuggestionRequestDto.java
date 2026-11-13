package com.saveliens.saveliens.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AiSuggestionRequestDto(
        @NotBlank
        @Size(max = 2048)
        String url
) {}