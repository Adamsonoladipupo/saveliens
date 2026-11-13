package com.saveliens.saveliens.controllers;

import com.saveliens.saveliens.dtos.requests.AiSuggestionRequestDto;
import com.saveliens.saveliens.dtos.responses.AiSuggestionResponseDto;
import com.saveliens.saveliens.services.AiSuggestionService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai/links")
public class AiSuggestionController {

    private final AiSuggestionService aiSuggestionService;

    public AiSuggestionController(
            AiSuggestionService aiSuggestionService
    ) {
        this.aiSuggestionService = aiSuggestionService;
    }

    @PostMapping("/suggest")
    public ResponseEntity<AiSuggestionResponseDto> suggest(
            @Valid @RequestBody AiSuggestionRequestDto request
    ) {
        return ResponseEntity.ok(
                aiSuggestionService.suggest(request)
        );
    }
}