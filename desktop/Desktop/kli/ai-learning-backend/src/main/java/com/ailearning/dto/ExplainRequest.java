package com.ailearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExplainRequest {
    private String content;
    private String mode; // "simple", "exam", "advanced"
    private String language; // "en", "es", "fr", etc.
}
