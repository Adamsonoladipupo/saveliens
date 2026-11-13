
package com.saveliens.saveliens.controllers;

import com.saveliens.saveliens.data.models.User;
import com.saveliens.saveliens.data.repositories.UserRepository;
import com.saveliens.saveliens.dtos.requests.LoginRequestDto;
import com.saveliens.saveliens.dtos.requests.UserRegistrationRequestDto;
import com.saveliens.saveliens.dtos.responses.LoginResponseDto;
import com.saveliens.saveliens.dtos.responses.UserRegistrationResponseDto;
import com.saveliens.saveliens.security.RefreshTokenCookieService;
import com.saveliens.saveliens.security.RefreshTokenService;
import com.saveliens.saveliens.services.UserServiceImp;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.saveliens.saveliens.events.LoginSucceededEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.transaction.annotation.Transactional;

@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "https://saveliens.onrender.com"
        },
        allowCredentials = "true"
)
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserServiceImp userService;
    private final RefreshTokenService refreshTokenService;
    private final RefreshTokenCookieService refreshTokenCookieService;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    public UserController(
            UserServiceImp userService,
            RefreshTokenService refreshTokenService,
            RefreshTokenCookieService refreshTokenCookieService,
            UserRepository userRepository,
            ApplicationEventPublisher eventPublisher
    ) {
        this.userService = userService;
        this.refreshTokenService = refreshTokenService;
        this.refreshTokenCookieService = refreshTokenCookieService;
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
    }

    @GetMapping("/greet")
    public String greet() {
        return "Hey User! Let's get the party started";
    }

    @PostMapping("/register")
    public ResponseEntity<UserRegistrationResponseDto> register(
            @RequestBody UserRegistrationRequestDto requestDto
    ) {
        UserRegistrationResponseDto responseDto =
                userService.register(requestDto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(responseDto);
    }


    @PostMapping("/login")
    @Transactional
    public ResponseEntity<LoginResponseDto> login(
            @RequestBody LoginRequestDto requestDto
    ) {
        LoginResponseDto responseDto =
                userService.login(requestDto);

        User user = userRepository
                .findByEmail(requestDto.getEmail())
                .orElseThrow();

        RefreshTokenService.IssuedRefreshToken refresh =
                refreshTokenService.issueToken(user);

        HttpHeaders headers = new HttpHeaders();

        refreshTokenCookieService.setCookie(
                headers,
                refresh.refreshToken()
        );

        eventPublisher.publishEvent(
                new LoginSucceededEvent(
                        user.getId(),
                        user.getFirstName(),
                        user.getEmail()
                )
        );

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(responseDto);
    }

}
