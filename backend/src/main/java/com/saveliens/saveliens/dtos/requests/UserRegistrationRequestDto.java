package com.saveliens.saveliens.dtos.requests;

import com.saveliens.saveliens.data.models.Occupation;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationRequestDto {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private Occupation occupation;
}
