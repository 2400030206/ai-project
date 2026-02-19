package com.ailearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PDFUploadResponse {
    private Long id;
    private String filename;
    private Long fileSize;
    private String message;
}
