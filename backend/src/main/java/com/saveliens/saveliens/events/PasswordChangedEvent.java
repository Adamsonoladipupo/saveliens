
package com.saveliens.saveliens.events;

public record PasswordChangedEvent(
        String userId,
        String firstName,
        String email
) {}
