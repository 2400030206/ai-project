package com.ailearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamResultResponse {
    private String examId;
    private Integer totalMarks;
    private Integer obtainedMarks;
    private Double percentage;
    private List<Map<String, Object>> results;
}
