package com.ailearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SmartSummaryResponse {
    private String title;
    private String overview;
    private List<String> keyPoints;
    private List<String> topics;
    private String conclusion;
    private Integer wordCount;
    private Integer readingTime;
}
