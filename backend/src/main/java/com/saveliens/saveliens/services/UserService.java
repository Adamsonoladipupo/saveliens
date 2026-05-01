package com.saveliens.saveliens.services;

import com.saveliens.saveliens.dtos.requests.AddLinkRequestDto;
import com.saveliens.saveliens.dtos.requests.CreateTopicRequestDto;
import com.saveliens.saveliens.dtos.requests.LoginRequestDto;
import com.saveliens.saveliens.dtos.requests.UserRegistrationRequestDto;
import com.saveliens.saveliens.dtos.responses.AddLinkResponseDto;
import com.saveliens.saveliens.dtos.responses.CreateTopicResponseDto;
import com.saveliens.saveliens.dtos.responses.LoginResponseDto;
import com.saveliens.saveliens.dtos.responses.UserRegistrationResponseDto;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    UserRegistrationResponseDto register(UserRegistrationRequestDto requestDto);
    LoginResponseDto login(LoginRequestDto requestDto);

//    CreateTopicResponseDto createTopic(CreateTopicRequestDto requestDto);
//    AddLinkResponseDto addLink(AddLinkRequestDto requestDto);


}
