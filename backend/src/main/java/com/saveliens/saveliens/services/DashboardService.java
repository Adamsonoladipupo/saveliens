package com.saveliens.saveliens.services;

import com.saveliens.saveliens.data.models.Topic;
import com.saveliens.saveliens.data.models.User;
import com.saveliens.saveliens.data.repositories.LinkRepository;
import com.saveliens.saveliens.data.repositories.TopicRepository;
import com.saveliens.saveliens.data.repositories.UserRepository;
import com.saveliens.saveliens.dtos.responses.DashboardResponseDto;
import com.saveliens.saveliens.dtos.responses.TopicSummaryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class DashboardService {
    private final UserRepository userRepository;
    private final TopicRepository topicRepository;
    private final LinkRepository linkRepository;

    public DashboardResponseDto getDashboard() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Topic> topics = topicRepository.findAllByUser(user);

        List<TopicSummaryDto> topicSummaries = topics.stream()
                .map(topic -> {
                    int linkCount = linkRepository.findAllByTopicId(topic.getId()).size();

                    return new TopicSummaryDto(
                            topic.getId(),
                            topic.getTitle(),
                            linkCount
                    );
                })
                .toList();

        long totalLinks = topicSummaries.stream()
                .mapToLong(TopicSummaryDto::getLinkCount)
                .sum();
        return new DashboardResponseDto(
                topics.size(),
                totalLinks,
                topicSummaries
        );
    }
}
