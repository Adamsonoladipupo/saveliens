
package com.saveliens.saveliens.dtos.requests;

public record ChangePasswordRequestDto(
        String currentPassword,
        String newPassword
) {}
