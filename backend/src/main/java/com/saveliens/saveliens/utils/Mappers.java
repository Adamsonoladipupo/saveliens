package com.saveliens.saveliens.utils;

import com.saveliens.saveliens.data.models.Link;
import com.saveliens.saveliens.data.models.Topic;
import com.saveliens.saveliens.data.models.User;
import com.saveliens.saveliens.dtos.requests.AddLinkRequestDto;
import com.saveliens.saveliens.dtos.requests.CreateTopicRequestDto;
import com.saveliens.saveliens.dtos.requests.UserRegistrationRequestDto;
import com.saveliens.saveliens.dtos.responses.AddLinkResponseDto;
import com.saveliens.saveliens.dtos.responses.CreateTopicResponseDto;
import com.saveliens.saveliens.dtos.responses.LoginResponseDto;
import com.saveliens.saveliens.dtos.responses.UserRegistrationResponseDto;

import java.time.LocalDateTime;

public class Mappers {
    public static Link mapToLinkEntity(AddLinkRequestDto requestDto, Topic topic){
        Link link = new Link();
        link.setUrl(requestDto.getUrl());
        link.setTopic(topic);
        link.setCreatedAt(LocalDateTime.now());
        return link;
    }

    public static AddLinkResponseDto mapToLinkDTO(Link link){
        AddLinkResponseDto linkResponseDto = new AddLinkResponseDto();
        linkResponseDto.setId(link.getId());
        linkResponseDto.setUrl(link.getUrl());
        linkResponseDto.setTopicId(link.getTopic().getId());
        linkResponseDto.setCreatedAt(link.getCreatedAt());
        return linkResponseDto;
    }

    public static User registrationRequest(UserRegistrationRequestDto requestDto){
        User newUser = new User();
        newUser.setEmail(requestDto.getEmail());
        newUser.setName(requestDto.getName());
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setPassword(requestDto.getPassword());
        return newUser;
    }

    public static UserRegistrationResponseDto registrationResponse(User user){
        UserRegistrationResponseDto responseDto = new UserRegistrationResponseDto();
        responseDto.setId(user.getId());
        responseDto.setEmail(user.getEmail());
        return responseDto;
    }

    public static LoginResponseDto loginResponse(User user) {
        LoginResponseDto responseDto = new LoginResponseDto();
        responseDto.setEmail(user.getEmail());
//        responseDto.setToken(user.getId());
        return responseDto;
    }

    public static Topic createTopicRequest(CreateTopicRequestDto requestDto, User user){
        Topic topic = new Topic();
        topic.setCreatedAt(LocalDateTime.now());
        topic.setUpdatedAt(LocalDateTime.now());
        topic.setTitle(requestDto.getTitle());
        topic.setDescription(requestDto.getDescription());
        topic.setUser(user);
        return topic;
    }

    public static CreateTopicResponseDto createTopicResponse(Topic topic){
        CreateTopicResponseDto responseDto = new CreateTopicResponseDto();
        responseDto.setCreatedAt(topic.getCreatedAt());
        responseDto.setDescription(topic.getDescription());
        responseDto.setTitle(topic.getTitle());
        responseDto.setUserId(topic.getUser().getId());
        responseDto.setId(topic.getId());
        return responseDto;

    }
}
