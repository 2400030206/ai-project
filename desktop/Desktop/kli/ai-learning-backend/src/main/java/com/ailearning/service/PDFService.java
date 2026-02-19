package com.ailearning.service;

import com.ailearning.dto.PDFUploadResponse;
import com.ailearning.dto.TextExtractionResponse;
import com.ailearning.entity.PDF;
import com.ailearning.repository.PDFRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PDFService {

    private final PDFRepository pdfRepository;
    private static final String UPLOAD_DIR = "uploads/pdfs/";

    public PDFUploadResponse uploadPDF(MultipartFile file) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String filename = UUID.randomUUID().toString() + "_" + originalFilename;
        String filePath = UPLOAD_DIR + filename;

        // Save file
        Path path = Paths.get(filePath);
        Files.write(path, file.getBytes());

        // Save to database
        PDF pdf = new PDF();
        pdf.setFilename(filename);
        pdf.setOriginalFilename(originalFilename);
        pdf.setFilePath(filePath);
        pdf.setFileSize(file.getSize());

        PDF savedPdf = pdfRepository.save(pdf);

        log.info("PDF uploaded successfully: {}", filename);

        return new PDFUploadResponse(
            savedPdf.getId(),
            savedPdf.getFilename(),
            savedPdf.getFileSize(),
            "PDF uploaded successfully"
        );
    }

    public TextExtractionResponse extractText(Long pdfId) throws IOException {
        PDF pdf = pdfRepository.findById(pdfId)
            .orElseThrow(() -> new RuntimeException("PDF not found with id: " + pdfId));

        // Extract text from PDF
        String extractedText = extractTextFromPDF(pdf.getFilePath());

        // Update PDF entity with extracted text
        pdf.setExtractedText(extractedText);
        pdfRepository.save(pdf);

        // Calculate statistics
        int wordCount = extractedText.split("\\s+").length;
        int characterCount = extractedText.length();

        log.info("Text extracted from PDF: {} (words: {}, chars: {})", 
            pdf.getFilename(), wordCount, characterCount);

        return new TextExtractionResponse(extractedText, wordCount, characterCount);
    }

    private String extractTextFromPDF(String filePath) throws IOException {
        File file = new File(filePath);
        try (PDDocument document = Loader.loadPDF(file)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    public PDF getPDF(Long id) {
        return pdfRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("PDF not found with id: " + id));
    }
}
