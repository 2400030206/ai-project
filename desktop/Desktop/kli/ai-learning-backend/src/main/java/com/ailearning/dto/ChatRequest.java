package com.ailearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {
    private String message;
    private String topic;
    private String difficulty; // beginner, intermediate, advanced
    private String context; // optional context from PDF or previous learning
}
