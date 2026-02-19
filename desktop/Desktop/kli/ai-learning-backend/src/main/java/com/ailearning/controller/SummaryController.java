package com.ailearning.controller;

import com.ailearning.dto.SmartSummaryRequest;
import com.ailearning.dto.SmartSummaryResponse;
import com.ailearning.service.SummaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/summary")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class SummaryController {

    private final SummaryService summaryService;

    @PostMapping("/generate")
    public ResponseEntity<SmartSummaryResponse> generateSummary(@RequestBody SmartSummaryRequest request) {
        try {
            log.info("Received summary generation request: type={}", request.getType());
            SmartSummaryResponse response = summaryService.generateSummary(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error generating summary", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
