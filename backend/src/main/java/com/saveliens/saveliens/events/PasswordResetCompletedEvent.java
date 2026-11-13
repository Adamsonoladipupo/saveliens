
package com.saveliens.saveliens.events;

public record PasswordResetCompletedEvent(
        String userId,
        String email,
        String firstName
) {}
