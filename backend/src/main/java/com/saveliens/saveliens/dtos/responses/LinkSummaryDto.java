package com.saveliens.saveliens.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RecentLinkDto {
    private String id;
    private String url;
    private String topicTitle;
}
