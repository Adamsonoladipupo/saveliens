
package com.saveliens.saveliens.security;

import com.saveliens.saveliens.data.models.RefreshToken;
import com.saveliens.saveliens.data.models.User;
import com.saveliens.saveliens.data.repositories.RefreshTokenRepository;
import com.saveliens.saveliens.data.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import com.saveliens.saveliens.exceptions.InvalidRefreshTokenException;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final long expirationDays;

    public RefreshTokenService(
            RefreshTokenRepository refreshTokenRepository,
            UserRepository userRepository,
            JwtService jwtService,
            @Value("${auth.refresh-token-expiration-days:7}")
            long expirationDays
    ) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.expirationDays = expirationDays;
    }

    public record IssuedRefreshToken(
            String refreshToken,
            Instant expiresAt
    ) {}

    public record RotatedTokens(
            String accessToken,
            String refreshToken,
            Instant refreshTokenExpiresAt
    ) {}

    @Transactional
    public IssuedRefreshToken issueToken(User user) {

        String rawToken = RefreshTokenUtils.generateToken();

        Instant now = Instant.now();
        Instant expiresAt = now.plus(
                expirationDays,
                ChronoUnit.DAYS
        );

        RefreshToken token = new RefreshToken();
        token.setUser(user);
        token.setTokenHash(
                RefreshTokenUtils.hashToken(rawToken)
        );
        token.setCreatedAt(now);
        token.setExpiresAt(expiresAt);

        refreshTokenRepository.save(token);

        return new IssuedRefreshToken(
                rawToken,
                expiresAt
        );
    }


    @Transactional
    public RotatedTokens rotate(String rawToken) {

        if (rawToken == null || rawToken.isBlank()) {
            throw new InvalidRefreshTokenException(
                    "Invalid or expired refresh token"
            );
        }

        String tokenHash =
                RefreshTokenUtils.hashToken(rawToken);

        Instant now = Instant.now();

        int updatedRows =
                refreshTokenRepository.revokeActiveToken(
                        tokenHash,
                        now
                );

        if (updatedRows != 1) {
            throw new InvalidRefreshTokenException(
                    "Invalid or expired refresh token"
            );
        }

        RefreshToken previousToken =
                refreshTokenRepository
                        .findByTokenHash(tokenHash)
                        .orElseThrow(() ->
                                new InvalidRefreshTokenException(
                                        "Invalid or expired refresh token"
                                )
                        );

        User user = userRepository
                .findById(previousToken.getUser().getId())
                .orElseThrow(() ->
                        new InvalidRefreshTokenException(
                                "Invalid or expired refresh token"
                        )
                );

        IssuedRefreshToken replacement = issueToken(user);

        return new RotatedTokens(
                jwtService.generateToken(user),
                replacement.refreshToken(),
                replacement.expiresAt()
        );
    }


    @Transactional
    public void revoke(String rawToken) {

        if (rawToken == null || rawToken.isBlank()) {
            return;
        }

        String tokenHash =
                RefreshTokenUtils.hashToken(rawToken);

        refreshTokenRepository.revokeActiveToken(
                tokenHash,
                Instant.now()
        );
    }

    @Transactional
    public void revokeAllForUser(String userId) {

        refreshTokenRepository.revokeAllUserTokens(
                userId,
                Instant.now()
        );
    }
}
