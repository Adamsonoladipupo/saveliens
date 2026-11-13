package com.saveliens.saveliens.data.repositories;

import com.saveliens.saveliens.data.models.OAuthIdentity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OAuthIdentityRepository extends JpaRepository<OAuthIdentity, String> {
    Optional<OAuthIdentity> findByProviderAndProviderUserId(
            String provider,
            String providerUserId
    );
}
