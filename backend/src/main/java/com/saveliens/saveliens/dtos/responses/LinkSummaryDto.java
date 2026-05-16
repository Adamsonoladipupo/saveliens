package com.saveliens.saveliens.dtos.responses;

import com.saveliens.saveliens.data.models.Topic;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LinkSummaryDto {
    private String id;
    private String url;
    private String topicTitle;
}
