
package com.saveliens.saveliens.data.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

import static jakarta.persistence.GenerationType.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(
        name = "refresh_tokens",
        indexes = {
                @Index(
                        name = "idx_refresh_tokens_user",
                        columnList = "user_id"
                ),
                @Index(
                        name = "idx_refresh_tokens_expiry",
                        columnList = "expires_at"
                )
        }
)
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(
            name = "token_hash",
            nullable = false,
            unique = true,
            length = 64
    )
    private String tokenHash;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "revoked_at")
    private Instant revokedAt;
}
