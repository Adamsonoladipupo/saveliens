package com.saveliens.saveliens.services;

import com.saveliens.saveliens.data.models.User;
import com.saveliens.saveliens.data.repositories.LinkRepository;
import com.saveliens.saveliens.data.repositories.TopicRepository;
import com.saveliens.saveliens.data.repositories.UserRepository;
import com.saveliens.saveliens.dtos.requests.LoginRequestDto;
import com.saveliens.saveliens.dtos.requests.UserRegistrationRequestDto;
import com.saveliens.saveliens.dtos.responses.LoginResponseDto;
import com.saveliens.saveliens.dtos.responses.UserRegistrationResponseDto;
import com.saveliens.saveliens.exceptions.EmailDuplicateException;
import com.saveliens.saveliens.exceptions.InvalidPasswordException;
import com.saveliens.saveliens.security.JwtService;
import com.saveliens.saveliens.utils.Mappers;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class UserServiceImp implements UserService{
    private final TopicRepository topicRepository;
    private final LinkRepository linkRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserRegistrationResponseDto register(UserRegistrationRequestDto requestDto) {
        if(userRepository.findByEmail(requestDto.getEmail()).isPresent()){
            throw new EmailDuplicateException("email already exist");
        }
        requestDto.setPassword(passwordEncoder.encode(requestDto.getPassword()));
        User user = Mappers.registrationRequest(requestDto);
        userRepository.save(user);
        return Mappers.registrationResponse(user);
    }

    @Override
    public LoginResponseDto login(LoginRequestDto requestDto) {
        User user = userRepository.findByEmail(requestDto.getEmail())
                .orElseThrow(()-> new EmailDuplicateException("Invalid credentials"));

        if(!passwordEncoder.matches(requestDto.getPassword(), user.getPassword())){
            throw  new InvalidPasswordException("Sorry, invalid password");
        }
        String token = jwtService.generateToken(user);
        return new LoginResponseDto(token, requestDto.getEmail());
    }
}
