package com.ailearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIExplanationRequest {
    private String content;
    private String mode = "simple";
    private String language = "en";
}
