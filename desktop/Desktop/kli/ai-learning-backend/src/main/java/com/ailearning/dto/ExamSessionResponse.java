package com.ailearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamSessionResponse {
    private String examId;
    private List<Map<String, Object>> questions;
    private Integer duration;
}
