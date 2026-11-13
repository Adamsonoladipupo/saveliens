
package com.saveliens.saveliens.controllers;

import com.saveliens.saveliens.data.models.User;
import com.saveliens.saveliens.data.repositories.UserRepository;
import com.saveliens.saveliens.security.RefreshTokenCookieService;
import com.saveliens.saveliens.security.RefreshTokenService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final RefreshTokenService refreshTokenService;
    private final UserRepository userRepository;
    private final RefreshTokenCookieService refreshTokenCookieService;

    public AuthController(
            RefreshTokenService refreshTokenService,
            UserRepository userRepository,
            RefreshTokenCookieService refreshTokenCookieService
    ) {
        this.refreshTokenService = refreshTokenService;
        this.userRepository = userRepository;
        this.refreshTokenCookieService = refreshTokenCookieService;
    }

    public record RefreshRequest(String refreshToken) {}

    public record LogoutRequest(String refreshToken) {}


    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
            @CookieValue(
                    name = "refresh_token",
                    required = false
            ) String refreshToken
    ) {
        RefreshTokenService.RotatedTokens tokens =
                refreshTokenService.rotate(refreshToken);

        HttpHeaders headers = new HttpHeaders();

        refreshTokenCookieService.setCookie(
                headers,
                tokens.refreshToken()
        );

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(Map.of(
                        "accessToken", tokens.accessToken()
                ));
    }



    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(
                    name = "refresh_token",
                    required = false
            ) String refreshToken
    ) {
        refreshTokenService.revoke(refreshToken);

        HttpHeaders headers = new HttpHeaders();

        refreshTokenCookieService.clearCookie(headers);

        return ResponseEntity
                .noContent()
                .headers(headers)
                .build();
    }


    @PostMapping("/logout-all")
    public ResponseEntity<Void> logoutAll(
            Authentication authentication
    ) {
        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow();

        refreshTokenService.revokeAllForUser(
                user.getId()
        );

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(
            Authentication authentication
    ) {
        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow();

        return ResponseEntity.ok(
                Map.of(
                        "id", user.getId(),
                        "email", user.getEmail(),
                        "firstName", user.getFirstName(),
                        "lastName", user.getLastName()
                )
        );
    }
}
