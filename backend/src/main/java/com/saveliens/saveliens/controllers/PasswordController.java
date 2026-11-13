
package com.saveliens.saveliens.controllers;

import com.saveliens.saveliens.dtos.requests.ChangePasswordRequestDto;
import com.saveliens.saveliens.security.RefreshTokenCookieService;
import com.saveliens.saveliens.services.PasswordService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users/me")
public class PasswordController {

    private final PasswordService passwordService;
    private final RefreshTokenCookieService cookieService;

    public PasswordController(
            PasswordService passwordService,
            RefreshTokenCookieService cookieService
    ) {
        this.passwordService = passwordService;
        this.cookieService = cookieService;
    }

    @PatchMapping("/password")
    public ResponseEntity<Map<String, String>> changePassword(
            Authentication authentication,
            @RequestBody ChangePasswordRequestDto request
    ) {
        passwordService.changePassword(
                authentication.getName(),
                request
        );

        HttpHeaders headers = new HttpHeaders();
        cookieService.clearCookie(headers);

        return ResponseEntity.ok()
                .headers(headers)
                .body(Map.of(
                        "message",
                        "Password changed successfully. Please sign in again."
                ));
    }
}
