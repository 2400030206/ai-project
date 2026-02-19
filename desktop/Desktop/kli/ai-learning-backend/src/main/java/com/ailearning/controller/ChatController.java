package com.ailearning.controller;

import com.ailearning.dto.ChatRequest;
import com.ailearning.dto.ChatResponse;
import com.ailearning.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/ask")
    public ResponseEntity<ChatResponse> askQuestion(@RequestBody ChatRequest request) {
        try {
            log.info("Received chat question: {}", request.getMessage());
            ChatResponse response = chatService.answerQuestion(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error processing chat question", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Chat service is healthy");
    }
}
