
package com.saveliens.saveliens.data.repositories;

import com.saveliens.saveliens.data.models.PasswordResetToken;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

import java.time.Instant;
import java.util.Optional;

public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, String> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT token
        FROM PasswordResetToken token
        WHERE token.tokenHash = :tokenHash
        """)
    Optional<PasswordResetToken> findByTokenHashForUpdate(
            @Param("tokenHash") String tokenHash
    );

    @Modifying
    @Query("""
        UPDATE PasswordResetToken token
        SET token.usedAt = :now
        WHERE token.user.id = :userId
          AND token.usedAt IS NULL
        """)
    int invalidateUnusedTokensForUser(
            @Param("userId") String userId,
            @Param("now") Instant now
    );

    @Query("""
    SELECT MAX(token.createdAt)
    FROM PasswordResetToken token
    WHERE token.user.id = :userId
    """)
    Optional<Instant> findLatestRequestTime(
            @Param("userId") String userId
    );
}
