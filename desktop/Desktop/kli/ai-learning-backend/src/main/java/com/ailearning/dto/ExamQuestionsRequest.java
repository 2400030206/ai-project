package com.ailearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamQuestionsRequest {
    private String content;
    private String difficulty = "medium";
    private Integer count = 10;
    private String category = "all";
    private String language = "en";
}
