package com.saveliens.saveliens.dtos.responses;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class LoginResponseDto {
    private String token;
    private String email;

}
