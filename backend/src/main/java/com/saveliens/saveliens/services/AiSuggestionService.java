package com.saveliens.saveliens.services;

import com.saveliens.saveliens.ai.AiProvider;
import com.saveliens.saveliens.data.models.Topic;
import com.saveliens.saveliens.data.models.User;
import com.saveliens.saveliens.data.repositories.TopicRepository;
import com.saveliens.saveliens.data.repositories.UserRepository;
import com.saveliens.saveliens.dtos.requests.AiSuggestionRequestDto;
import com.saveliens.saveliens.dtos.responses.AiSuggestionResponseDto;
import com.saveliens.saveliens.exceptions.NonExistingUserException;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Set;

@Service
public class AiSuggestionService {

    private final AiProvider aiProvider;
    private final UserRepository userRepository;
    private final TopicRepository topicRepository;

    public AiSuggestionService(
            AiProvider aiProvider,
            UserRepository userRepository,
            TopicRepository topicRepository
    ) {
        this.aiProvider = aiProvider;
        this.userRepository = userRepository;
        this.topicRepository = topicRepository;
    }

    public AiSuggestionResponseDto suggest(
            AiSuggestionRequestDto request
    ) {
        String url = validateUrl(request.url());

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication required"
            );
        }

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new NonExistingUserException("User not found")
                );

        List<Topic> topics = topicRepository.findAllByUser(user);

        // An account with no topics can still receive a new-topic suggestion.
        List<AiProvider.TopicOption> options = topics.stream()
                .map(topic -> new AiProvider.TopicOption(
                        topic.getId(),
                        topic.getTitle(),
                        topic.getDescription()
                ))
                .toList();

        AiProvider.AiResult result =
                aiProvider.suggest(url, options);

        if (result == null || result.type() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "AI returned an invalid suggestion"
            );
        }

        return switch (result.type()) {

            case EXISTING_TOPIC -> {
                Topic selected = topics.stream()
                        .filter(topic ->
                                topic.getId().equals(result.topicId())
                        )
                        .findFirst()
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.BAD_GATEWAY,
                                        "AI suggested an unavailable topic"
                                )
                        );

                yield new AiSuggestionResponseDto(
                        result.type(),
                        selected.getId(),
                        selected.getTitle(),
                        selected.getDescription(),
                        result.summary(),
                        result.reason()
                );
            }

            case NEW_TOPIC -> {
                if (result.suggestedTopicName() == null
                        || result.suggestedTopicName().isBlank()
                        || result.suggestedTopicDescription() == null
                        || result.suggestedTopicDescription().isBlank()) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_GATEWAY,
                            "AI returned incomplete topic information"
                    );
                }

                yield new AiSuggestionResponseDto(
                        result.type(),
                        null,
                        result.suggestedTopicName(),
                        result.suggestedTopicDescription(),
                        result.summary(),
                        result.reason()
                );
            }

            case UNCERTAIN -> new AiSuggestionResponseDto(
                    result.type(),
                    null,
                    null,
                    null,
                    result.summary(),
                    result.reason()
            );
        };
    }

    private String validateUrl(String input) {

        if (input == null || input.isBlank() || input.length() > 2048) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A valid URL is required"
            );
        }

        try {
            URI uri = new URI(input.trim());

            String scheme = uri.getScheme();

            if (scheme == null ||
                    (!scheme.equalsIgnoreCase("http")
                            && !scheme.equalsIgnoreCase("https"))
                    || uri.getHost() == null
                    || uri.getUserInfo() != null) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Only valid HTTP or HTTPS URLs are supported"
                );
            }

            return uri.toString();

        } catch (URISyntaxException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Malformed URL"
            );
        }
    }
}