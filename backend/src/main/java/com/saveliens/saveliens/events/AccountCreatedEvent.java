
package com.saveliens.saveliens.events;

public record AccountCreatedEvent(
        String userId,
        String firstName,
        String email
) {}
