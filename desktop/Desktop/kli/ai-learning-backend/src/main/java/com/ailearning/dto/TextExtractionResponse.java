package com.ailearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TextExtractionResponse {
    private String text;
    private Integer wordCount;
    private Integer characterCount;
}
