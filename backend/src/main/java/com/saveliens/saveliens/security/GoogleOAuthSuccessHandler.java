package com.saveliens.saveliens.security;

import com.saveliens.saveliens.data.models.OAuthIdentity;
import com.saveliens.saveliens.data.models.User;
import com.saveliens.saveliens.data.repositories.OAuthIdentityRepository;
import com.saveliens.saveliens.data.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.LocalDateTime;

import com.saveliens.saveliens.events.AccountCreatedEvent;
import org.springframework.context.ApplicationEventPublisher;

@Component
public class GoogleOAuthSuccessHandler
        implements AuthenticationSuccessHandler {

    private final OAuthIdentityRepository identities;
    private final UserRepository users;
    private final OAuthExchangeService exchanges;
    private final ApplicationEventPublisher eventPublisher;

    public GoogleOAuthSuccessHandler(
            OAuthIdentityRepository identities,
            UserRepository users,
            OAuthExchangeService exchanges,
            ApplicationEventPublisher eventPublisher
    ) {
        this.identities = identities;
        this.users = users;
        this.exchanges = exchanges;
        this.eventPublisher = eventPublisher;
    }

    @Override
    @Transactional
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        OidcUser google = (OidcUser) authentication.getPrincipal();

        String providerId = google.getSubject();
        String email = google.getEmail();

        if (email == null ||
                !Boolean.TRUE.equals(google.getEmailVerified())) {
            response.sendRedirect(
                    "http://localhost:5173/signup?oauth_error=email"
            );
            return;
        }

        String normalizedEmail = email.trim().toLowerCase();

        User user = identities
                .findByProviderAndProviderUserId("google", providerId)
                .map(OAuthIdentity::getUser)
                .orElse(null);

        if (user == null) {
            // Do not automatically link an existing password account.
            if (users.existsByEmail(normalizedEmail)) {
                response.sendRedirect(
                        "http://localhost:5173/signup?oauth_error=conflict"
                );
                return;
            }

            user = new User();
            user.setEmail(normalizedEmail);
            user.setFirstName(
                    safeName(google.getGivenName())
            );
            user.setLastName(
                    safeName(google.getFamilyName())
            );
            user.setCreatedAt(LocalDateTime.now());
            user = users.save(user);

            OAuthIdentity identity = new OAuthIdentity();
            identity.setProvider("google");
            identity.setProviderUserId(providerId);
            identity.setUser(user);
            identities.save(identity);
            eventPublisher.publishEvent(
                    new AccountCreatedEvent(
                            user.getId(),
                            user.getFirstName(),
                            user.getEmail()
                    )
            );
        }

        String code = exchanges.create(user.getId());

        String redirect = UriComponentsBuilder
                .fromUriString("http://localhost:5173/oauth/callback")
                .queryParam("code", code)
                .build()
                .toUriString();

        response.sendRedirect(redirect);
    }

    private String safeName(String name) {
        return name == null || name.isBlank()
                ? "Not provided"
                : name.trim();
    }
}