package com.saveliens.saveliens.services;

import com.saveliens.saveliens.data.models.Link;
import com.saveliens.saveliens.data.models.Topic;
import com.saveliens.saveliens.data.models.User;
import com.saveliens.saveliens.data.repositories.LinkRepository;
import com.saveliens.saveliens.data.repositories.TopicRepository;
import com.saveliens.saveliens.data.repositories.UserRepository;
import com.saveliens.saveliens.dtos.responses.DashboardResponseDto;
import com.saveliens.saveliens.dtos.responses.LinkSummaryDto;
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

        String firstName =user.getFirstName();

        List<Topic> topics = topicRepository.findAllByUser(user);

        List<TopicSummaryDto> topicSummaries = topics.stream()
                .map(topic -> {
                    int linkCount = linkRepository.findAllByTopicId(topic.getId()).size();

                    return new TopicSummaryDto(
                            topic.getId(),
                            topic.getTitle(),
                            linkCount,
                            topic.getDescription()
                    );
                })
                .toList();

        long totalLinks = topicSummaries.stream()
                .mapToLong(TopicSummaryDto::getLinkCount)
                .sum();

        List<Link> links = linkRepository
                .findByTopicUserOrderByCreatedAtDesc(user);
        List<LinkSummaryDto> linkDtos = links.stream()
                .map(link -> new LinkSummaryDto(
                        link.getId(),
                        link.getUrl(),
                        link.getTopic().getTitle()
                ))
                .toList();


        return new DashboardResponseDto(
                firstName,
                topics.size(),
                totalLinks,
                topicSummaries,
                linkDtos


        );
    }
}
