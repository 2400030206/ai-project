package com.ailearning.controller;

import com.ailearning.dto.ExamSessionRequest;
import com.ailearning.dto.ExamSessionResponse;
import com.ailearning.dto.SubmitExamRequest;
import com.ailearning.dto.ExamResultResponse;
import com.ailearning.service.ExamService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/exam")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class ExamController {

    private final ExamService examService;

    @PostMapping("/start")
    public ResponseEntity<ExamSessionResponse> startExam(@RequestBody ExamSessionRequest request) {
        try {
            log.info("Received exam start request: title={}, duration={}", 
                request.getTitle(), request.getDuration());
            ExamSessionResponse response = examService.startExamSession(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error starting exam", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<ExamResultResponse> submitExam(@RequestBody SubmitExamRequest request) {
        try {
            log.info("Received exam submission: examId={}", request.getExamId());
            ExamResultResponse response = examService.submitExam(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error submitting exam", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
