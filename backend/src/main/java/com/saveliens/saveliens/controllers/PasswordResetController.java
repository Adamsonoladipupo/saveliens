
package com.saveliens.saveliens.controllers;

import com.saveliens.saveliens.dtos.requests.ForgotPasswordRequestDto;
import com.saveliens.saveliens.dtos.requests.ResetPasswordRequestDto;
import com.saveliens.saveliens.services.PasswordResetService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(
            PasswordResetService passwordResetService
    ) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @RequestBody ForgotPasswordRequestDto request
    ) {
        passwordResetService.requestPasswordReset(
                request.email()
        );

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "If an account exists for this email, a password reset link will be sent."
                )
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @RequestBody ResetPasswordRequestDto request
    ) {
        passwordResetService.resetPassword(request);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Password reset successfully. Please sign in again."
                )
        );
    }
}
