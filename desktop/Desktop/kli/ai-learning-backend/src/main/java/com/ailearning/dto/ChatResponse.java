package com.ailearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    private String response;
    private String explanation;
    private List<String> keyPoints;
    private String diagram;
    private String relatedTopics;
    private boolean hasVisualAid;
}
