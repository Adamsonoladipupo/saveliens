
package com.saveliens.saveliens.dtos.requests;

public record ResetPasswordRequestDto(
        String token,
        String newPassword
) {}
