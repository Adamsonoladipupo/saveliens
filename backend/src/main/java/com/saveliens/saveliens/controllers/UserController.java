
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

    public UserController(
            UserServiceImp userService,
            RefreshTokenService refreshTokenService,
            RefreshTokenCookieService refreshTokenCookieService,
            UserRepository userRepository
    ) {
        this.userService = userService;
        this.refreshTokenService = refreshTokenService;
        this.refreshTokenCookieService = refreshTokenCookieService;
        this.userRepository = userRepository;
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
    public ResponseEntity<LoginResponseDto> login(
            @RequestBody LoginRequestDto requestDto
    ) {
        // Authenticate user and generate access token.
        LoginResponseDto responseDto =
                userService.login(requestDto);

        // Retrieve the authenticated user.
        User user = userRepository
                .findByEmail(
                        requestDto.getEmail().trim().toLowerCase()
                )
                .orElseThrow();

        // Generate and persist a refresh token.
        RefreshTokenService.IssuedRefreshToken refresh =
                refreshTokenService.issueToken(user);

        // Attach refresh token as an HttpOnly cookie.
        HttpHeaders headers = new HttpHeaders();

        refreshTokenCookieService.setCookie(
                headers,
                refresh.refreshToken()
        );

        // Return the existing login response.
        return ResponseEntity
                .ok()
                .headers(headers)
                .body(responseDto);
    }
}
