
package com.saveliens.saveliens.events;

public record PasswordResetRequestedEvent(
        String userId,
        String email,
        String firstName,
        String resetUrl
) {}

