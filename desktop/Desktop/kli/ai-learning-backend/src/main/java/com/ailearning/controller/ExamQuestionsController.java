package com.ailearning.controller;

import com.ailearning.dto.ExamQuestionsRequest;
import com.ailearning.dto.ExamQuestionsResponse;
import com.ailearning.service.ExamQuestionsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/exam-questions")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class ExamQuestionsController {

    private final ExamQuestionsService examQuestionsService;

    @PostMapping("/generate")
    public ResponseEntity<ExamQuestionsResponse> generateExamQuestions(@RequestBody ExamQuestionsRequest request) {
        try {
            log.info("Received exam questions generation request: difficulty={}, category={}", 
                request.getDifficulty(), request.getCategory());
            ExamQuestionsResponse response = examQuestionsService.generateExamQuestions(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error generating exam questions", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
