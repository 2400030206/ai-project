package com.ailearning.controller;

import com.ailearning.dto.PDFUploadResponse;
import com.ailearning.dto.TextExtractionResponse;
import com.ailearning.service.PDFService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/pdf")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class PDFController {

    private final PDFService pdfService;

    @PostMapping("/upload")
    public ResponseEntity<PDFUploadResponse> uploadPDF(@RequestParam("file") MultipartFile file) {
        try {
            log.info("Received PDF upload request: {}", file.getOriginalFilename());
            PDFUploadResponse response = pdfService.uploadPDF(file);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error uploading PDF", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}/text")
    public ResponseEntity<TextExtractionResponse> getExtractedText(@PathVariable Long id) {
        try {
            TextExtractionResponse response = pdfService.extractText(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error extracting text from PDF", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
