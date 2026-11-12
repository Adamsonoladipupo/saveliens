package com.saveliens.saveliens.services;

import com.saveliens.saveliens.data.models.Link;
import com.saveliens.saveliens.data.models.Topic;
import com.saveliens.saveliens.data.models.User;
import com.saveliens.saveliens.data.repositories.LinkRepository;
import com.saveliens.saveliens.data.repositories.TopicRepository;
import com.saveliens.saveliens.data.repositories.UserRepository;
import com.saveliens.saveliens.dtos.requests.AddLinkRequestDto;
import com.saveliens.saveliens.dtos.responses.AddLinkResponseDto;
import com.saveliens.saveliens.exceptions.NonExistingUserException;
import com.saveliens.saveliens.exceptions.NullLinkException;
import com.saveliens.saveliens.exceptions.NullTopicException;
import com.saveliens.saveliens.exceptions.UnauthorizedException;
import com.saveliens.saveliens.utils.Mappers;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LinkService {
    private final LinkRepository linkRepository;
    private final TopicRepository topicRepository;
    private final UserRepository userRepository;

    public LinkService( LinkRepository linkRepository, TopicRepository topicRepository, UserRepository userRepository){
        this.linkRepository = linkRepository;
        this.topicRepository = topicRepository;
        this.userRepository = userRepository;
    }

    public AddLinkResponseDto addLink(AddLinkRequestDto requestDto, String topicId){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new NullTopicException("Sorry topic does not exist"));

        if (!topic.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Unauthorized");
        }

        Link link = Mappers.mapToLinkEntity(requestDto, topic);
        linkRepository.save(link);
        return Mappers.mapToLinkDTO(link);
    }


    public List<AddLinkResponseDto> getAllUserLinks(String topicId) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() ->
                        new NullTopicException("Topic not found")
                );

        // Security: verify topic ownership before retrieving links
        if (!topic.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException(
                    "You are not authorized to access this topic's links"
            );
        }

        List<Link> links = linkRepository.findAllByTopicId(topicId);

        return links.stream()
                .map(Mappers::mapToLinkDTO)
                .toList();
    }


    public void deleteLink(String topicId, String linkId) {

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new NonExistingUserException("User not found")
                );

        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() ->
                        new NullTopicException("Topic not found")
                );

        if (!topic.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException(
                    "You are not authorized to access this topic"
            );
        }

        Link link = linkRepository.findById(linkId)
                .orElseThrow(() ->
                        new NullLinkException("Link not found")
                );

        if (!link.getTopic().getId().equals(topic.getId())) {
            throw new NullLinkException(
                    "Link does not belong to this topic"
            );
        }

        linkRepository.delete(link);
    }

}
