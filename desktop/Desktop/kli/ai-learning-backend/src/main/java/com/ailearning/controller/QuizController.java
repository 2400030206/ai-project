package com.ailearning.controller;

import com.ailearning.dto.QuizRequest;
import com.ailearning.dto.QuizResponse;
import com.ailearning.service.QuizService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class QuizController {

    private final QuizService quizService;

    @PostMapping("/generate")
    public ResponseEntity<QuizResponse> generateQuiz(@RequestBody QuizRequest request) {
        try {
            log.info("Received quiz generation request: type={}, count={}", 
                request.getType(), request.getCount());
            QuizResponse response = quizService.generateQuiz(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error generating quiz", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/generate-ai")
    public ResponseEntity<QuizResponse> generateAIQuiz(@RequestBody QuizRequest request) {
        try {
            log.info("Received AI quiz generation request: type={}, count={}", 
                request.getType(), request.getCount());
            QuizResponse response = quizService.generateAIQuiz(
                request.getContent(), 
                request.getType(), 
                request.getCount()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error generating AI quiz", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitQuiz(
            @RequestParam String quizId,
            @RequestBody Map<String, String> answers) {
        try {
            log.info("Received quiz submission: quizId={}", quizId);
            Map<String, Object> result = quizService.submitQuiz(quizId, answers);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error submitting quiz", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
