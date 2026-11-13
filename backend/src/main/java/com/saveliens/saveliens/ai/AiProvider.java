package com.saveliens.saveliens.ai;

import java.util.List;

public interface AiProvider {

    AiResult suggest(
            String url,
            List<TopicOption> topics
    );

    record TopicOption(
            String id,
            String title,
            String description
    ) {}

    enum SuggestionType {
        EXISTING_TOPIC,
        NEW_TOPIC,
        UNCERTAIN
    }

    record AiResult(
            SuggestionType type,
            String topicId,
            String suggestedTopicName,
            String suggestedTopicDescription,
            String summary,
            String reason
    ) {}
}