package com.ailearning.controller;

import com.ailearning.dto.RevisionNotesRequest;
import com.ailearning.dto.RevisionNotesResponse;
import com.ailearning.service.RevisionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/revision")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class RevisionController {

    private final RevisionService revisionService;

    @PostMapping("/generate")
    public ResponseEntity<RevisionNotesResponse> generateRevisionNotes(@RequestBody RevisionNotesRequest request) {
        try {
            log.info("Received revision notes generation request");
            RevisionNotesResponse response = revisionService.generateRevisionNotes(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error generating revision notes", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
