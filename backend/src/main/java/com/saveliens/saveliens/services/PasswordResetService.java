
package com.saveliens.saveliens.services;

import com.saveliens.saveliens.data.models.PasswordResetToken;
import com.saveliens.saveliens.data.models.User;
import com.saveliens.saveliens.data.repositories.PasswordResetTokenRepository;
import com.saveliens.saveliens.data.repositories.UserRepository;
import com.saveliens.saveliens.dtos.requests.ResetPasswordRequestDto;
import com.saveliens.saveliens.events.PasswordResetCompletedEvent;
import com.saveliens.saveliens.events.PasswordResetRequestedEvent;
import com.saveliens.saveliens.security.RefreshTokenService;
import com.saveliens.saveliens.security.RefreshTokenUtils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Locale;
import java.util.Optional;

@Service
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;
    private final ApplicationEventPublisher eventPublisher;
    private final String frontendUrl;

    public PasswordResetService(
            UserRepository userRepository,
            PasswordResetTokenRepository resetTokenRepository,
            PasswordEncoder passwordEncoder,
            RefreshTokenService refreshTokenService,
            ApplicationEventPublisher eventPublisher,
            @Value("${saveliens.app.frontend-url}")
            String frontendUrl
    ) {
        this.userRepository = userRepository;
        this.resetTokenRepository = resetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenService = refreshTokenService;
        this.eventPublisher = eventPublisher;
        this.frontendUrl = frontendUrl;
    }

    @Transactional
    public void requestPasswordReset(String email) {

        if (email == null || email.isBlank()) {
            return;
        }

        Optional<User> optionalUser =
                userRepository.findByEmailForUpdate(
                        email.trim().toLowerCase(Locale.ROOT)
                );

        if (optionalUser.isEmpty()) {
            return;
        }

        User user = optionalUser.get();

        if (user.getPassword() == null) {
            return;
        }

        Instant now = Instant.now();

        Optional<Instant> lastRequest =
                resetTokenRepository.findLatestRequestTime(
                        user.getId()
                );

        if (lastRequest.isPresent()
                && lastRequest.get().isAfter(
                now.minusSeconds(60)
        )) {
            return;
        }

//        resetTokenRepository.invalidateUnusedTokensForUser(
//                user.getId(),
//                now
//        );

        String rawToken = RefreshTokenUtils.generateToken();

        String tokenHash = RefreshTokenUtils.hashToken(rawToken);

        PasswordResetToken resetToken = new PasswordResetToken();

        resetToken.setUser(user);
        resetToken.setTokenHash(tokenHash);
        resetToken.setCreatedAt(now);

        resetToken.setExpiresAt(
                now.plus(15, ChronoUnit.MINUTES)
        );

        resetToken.setIssuedTokenVersion(
                user.getTokenVersion()
        );

        resetTokenRepository.save(resetToken);

        String resetUrl =
                frontendUrl.replaceAll("/+$", "")
                        + "/reset-password?token="
                        + URLEncoder.encode(
                        rawToken,
                        StandardCharsets.UTF_8
                );

        // Email is sent asynchronously after commit.
        eventPublisher.publishEvent(
                new PasswordResetRequestedEvent(
                        user.getId(),
                        user.getEmail(),
                        user.getFirstName(),
                        resetUrl
                )
        );
    }

    @Transactional
    public void resetPassword(ResetPasswordRequestDto request) {

        if (request == null
                || request.token() == null
                || request.token().isBlank()
                || request.newPassword() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid password reset request"
            );
        }

        if (request.token().length() > 512) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid or expired password reset token"
            );
        }

        String newPassword = request.newPassword();

        if (newPassword.length() < 12
                || newPassword.length() > 128) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Password must contain 12 to 128 characters"
            );
        }

        String tokenHash;

        try {
            tokenHash = RefreshTokenUtils.hashToken(
                    request.token()
            );
        } catch (IllegalArgumentException exception) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid or expired password reset token"
            );
        }

        Instant now = Instant.now();


        PasswordResetToken resetToken =
                resetTokenRepository
                        .findByTokenHashForUpdate(tokenHash)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Invalid or expired password reset token"
                                )
                        );

        if (resetToken.getUsedAt() != null
                || !resetToken.getExpiresAt().isAfter(now)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid or expired password reset token"
            );
        }

        User user = userRepository
                .findByIdForUpdate(
                        resetToken.getUser().getId()
                )
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "Invalid or expired password reset token"
                        )
                );

        if (resetToken.getIssuedTokenVersion()
                != user.getTokenVersion()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid or expired password reset token"
            );
        }

        if (user.getPassword() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Password reset is unavailable for this account"
            );
        }

        if (passwordEncoder.matches(
                newPassword,
                user.getPassword()
        )) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "New password must differ from current password"
            );
        }

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        user.setTokenVersion(
                user.getTokenVersion() + 1
        );

        resetToken.setUsedAt(now);

        userRepository.save(user);
        resetTokenRepository.save(resetToken);

        resetTokenRepository.invalidateUnusedTokensForUser(
                user.getId(),
                now
        );

        refreshTokenService.revokeAllForUser(
                user.getId()
        );

        eventPublisher.publishEvent(
                new PasswordResetCompletedEvent(
                        user.getId(),
                        user.getEmail(),
                        user.getFirstName()
                )
        );
    }
}
