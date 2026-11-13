
package com.saveliens.saveliens.data.repositories;

import com.saveliens.saveliens.data.models.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;

public interface RefreshTokenRepository
        extends JpaRepository<RefreshToken, String> {

    Optional<RefreshToken> findByTokenHash(String tokenHash);

    @Modifying
    @Query("""
        UPDATE RefreshToken t
        SET t.revokedAt = :revokedAt
        WHERE t.tokenHash = :tokenHash
          AND t.revokedAt IS NULL
          AND t.expiresAt > :revokedAt
        """)
    int revokeActiveToken(
            @Param("tokenHash") String tokenHash,
            @Param("revokedAt") Instant revokedAt
    );

    @Modifying
    @Query("""
        UPDATE RefreshToken t
        SET t.revokedAt = :revokedAt
        WHERE t.user.id = :userId
          AND t.revokedAt IS NULL
        """)
    int revokeAllUserTokens(
            @Param("userId") String userId,
            @Param("revokedAt") Instant revokedAt
    );
}
