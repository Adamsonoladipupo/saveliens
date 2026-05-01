package com.saveliens.saveliens.dtos.requests;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AddLinkRequestDto {
    private String url;
}
