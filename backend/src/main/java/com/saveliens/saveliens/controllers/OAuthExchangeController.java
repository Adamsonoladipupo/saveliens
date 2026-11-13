
package com.saveliens.saveliens.controllers;

import com.saveliens.saveliens.data.models.User;
import com.saveliens.saveliens.data.repositories.UserRepository;
import com.saveliens.saveliens.security.JwtService;
import com.saveliens.saveliens.security.OAuthExchangeService;
import com.saveliens.saveliens.security.RefreshTokenCookieService;
import com.saveliens.saveliens.security.RefreshTokenService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.saveliens.saveliens.events.LoginSucceededEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/oauth")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "https://saveliens.onrender.com"
        },
        allowCredentials = "true"
)
public class OAuthExchangeController {

    private final OAuthExchangeService exchanges;
    private final UserRepository users;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final RefreshTokenCookieService refreshTokenCookieService;
    private final ApplicationEventPublisher eventPublisher;

    public OAuthExchangeController(
            OAuthExchangeService exchanges,
            UserRepository users,
            JwtService jwtService,
            RefreshTokenService refreshTokenService,
            RefreshTokenCookieService refreshTokenCookieService,
            ApplicationEventPublisher eventPublisher
    ) {
        this.exchanges = exchanges;
        this.users = users;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.refreshTokenCookieService = refreshTokenCookieService;
        this.eventPublisher = eventPublisher;
    }


    @PostMapping("/exchange")
    @Transactional
    public ResponseEntity<?> exchange(
            @RequestBody Map<String, String> request
    ) {
        String userId;

        try {
            userId = exchanges.consume(request.get("code"));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            "Invalid or expired OAuth code"
                    )
            );
        }

        User user = users.findById(userId)
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
                .body(
                        Map.of(
                                "token", jwtService.generateToken(user),
                                "email", user.getEmail(),
                                "needsOnboarding",
                                user.getOccupation() == null
                        )
                );
    }

}
