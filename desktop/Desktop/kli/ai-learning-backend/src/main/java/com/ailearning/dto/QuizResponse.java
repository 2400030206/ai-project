package com.ailearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizResponse {
    private List<QuestionDTO> questions;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionDTO {
        private String id;
        private String question;
        private String type;
        private List<String> options;
        private String correctAnswer;
        private String explanation;
    }
}
