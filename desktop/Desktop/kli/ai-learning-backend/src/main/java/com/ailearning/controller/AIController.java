package com.ailearning.controller;

import com.ailearning.dto.ExplainRequest;
import com.ailearning.dto.ExplainResponse;
import com.ailearning.service.AIService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class AIController {

    private final AIService aiService;

    @PostMapping("/explain")
    public ResponseEntity<ExplainResponse> explainContent(@RequestBody ExplainRequest request) {
        try {
            log.info("Received explanation request with mode: {}", request.getMode());
            ExplainResponse response = aiService.generateExplanation(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error generating explanation", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
