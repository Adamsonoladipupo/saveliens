
package com.saveliens.saveliens.events;

public record LoginSucceededEvent(
        String userId,
        String firstName,
        String email
) {}
