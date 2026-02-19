package com.ailearning.controller;

import com.ailearning.dto.FlashcardsRequest;
import com.ailearning.dto.FlashcardsResponse;
import com.ailearning.service.FlashcardsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/flashcards")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class FlashcardsController {

    private final FlashcardsService flashcardsService;

    @PostMapping("/generate")
    public ResponseEntity<FlashcardsResponse> generateFlashcards(@RequestBody FlashcardsRequest request) {
        try {
            log.info("Received flashcards generation request: count={}", request.getCount());
            FlashcardsResponse response = flashcardsService.generateFlashcards(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error generating flashcards", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
