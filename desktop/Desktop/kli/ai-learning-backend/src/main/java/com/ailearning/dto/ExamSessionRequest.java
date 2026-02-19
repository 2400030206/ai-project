package com.ailearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamSessionRequest {
    private String title;
    private Integer duration; // in minutes
    private Integer questionCount;
    private String content; // content to generate questions from
}
