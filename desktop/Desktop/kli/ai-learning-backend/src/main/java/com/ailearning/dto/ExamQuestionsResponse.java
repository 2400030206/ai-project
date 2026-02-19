package com.ailearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamQuestionsResponse {
    private List<ExamQuestionDTO> questions;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExamQuestionDTO {
        private String question;
        private String difficulty;
        private String category;
        private Integer marks;
        private String answer;
        private String explanation;
        private List<String> keyPoints;
        private String questionType; // mcq, short, long, diagram-based
        private String diagram; // ASCII diagram or description
        private String diagramDescription; // Text description of what the diagram shows
        private Integer marksAllocated; // Marks for this specific question
    }
}
