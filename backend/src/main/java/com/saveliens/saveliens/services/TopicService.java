package com.saveliens.saveliens.services;

import com.saveliens.saveliens.data.models.Link;
import com.saveliens.saveliens.data.models.Topic;
import com.saveliens.saveliens.data.models.User;
import com.saveliens.saveliens.data.repositories.LinkRepository;
import com.saveliens.saveliens.data.repositories.TopicRepository;
import com.saveliens.saveliens.data.repositories.UserRepository;
import com.saveliens.saveliens.dtos.requests.CreateTopicRequestDto;
import com.saveliens.saveliens.dtos.requests.DeleteTopicRequestDto;
import com.saveliens.saveliens.dtos.responses.AddLinkResponseDto;
import com.saveliens.saveliens.dtos.responses.CreateTopicResponseDto;
import com.saveliens.saveliens.dtos.responses.TopicWithLinksResponseDto;
import com.saveliens.saveliens.exceptions.NonExistingUserException;
import com.saveliens.saveliens.exceptions.NullTopicException;
import com.saveliens.saveliens.exceptions.UnauthorizedException;
import com.saveliens.saveliens.utils.Mappers;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class TopicService {
    private final TopicRepository topicRepository;
    private final LinkRepository linkRepository;
    private final UserRepository userRepository;

    public CreateTopicResponseDto createTopic(CreateTopicRequestDto requestDto){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new NonExistingUserException("user does not exist"));

        Topic topic = Mappers.createTopicRequest(requestDto, user);
        topicRepository.save(topic);
        return Mappers.createTopicResponse(topic);
    }

    public List<CreateTopicResponseDto> getUserTopics() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NonExistingUserException("User not found"));

        List<Topic> topics = topicRepository.findAllByUser(user);
        List<CreateTopicResponseDto> topicResponse = new ArrayList<>();
        for (Topic topic: topics){
            topicResponse.add(Mappers.createTopicResponse(topic));
        }
        return topicResponse;
    }

    public TopicWithLinksResponseDto getTopicWithLinks(String topicId) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new NullTopicException("Topic not found"));

        if (!topic.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You don't own this topic");
        }

        List<Link> links = linkRepository.findAllByTopicId(topicId);

        List<AddLinkResponseDto> linkDtos = links.stream()
                .map(Mappers::mapToLinkDTO)
                .toList();

        return new TopicWithLinksResponseDto(
                topic.getId(),
                topic.getTitle(),
                topic.getDescription(),
                topic.getCreatedAt(),
                topic.getUpdatedAt(),
                linkDtos
        );
    }

    public void deleteTopic(DeleteTopicRequestDto requestDto){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NonExistingUserException("User not found"));

        Topic topic = topicRepository.findById(requestDto.getTopicId())
                .orElseThrow(()-> new NullTopicException("Topic does not exist"));

        if (!topic.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        topicRepository.delete(topic);
    }
}
