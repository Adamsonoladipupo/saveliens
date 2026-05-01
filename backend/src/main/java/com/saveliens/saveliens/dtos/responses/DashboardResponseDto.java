package com.saveliens.saveliens.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponseDto {
    private long totalTopics;
    private long totalLinks;
    private List<TopicSummaryDto> topics;
}
