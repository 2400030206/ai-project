package com.ailearning.controller;

import com.ailearning.dto.LectureRequest;
import com.ailearning.dto.LectureResponse;
import com.ailearning.service.LectureService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lecture")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class LectureController {

    private final LectureService lectureService;

    @PostMapping("/generate")
    public ResponseEntity<LectureResponse> generateLecture(@RequestBody LectureRequest request) {
        try {
            log.info("Received lecture generation request");
            LectureResponse response = lectureService.generateLecture(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error generating lecture", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
