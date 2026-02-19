package com.ailearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VideoUploadResponse {
    private Long id;
    private String title;
    private String filename;
    private Long fileSize;
    private String fileSizeFormatted;
    private String language;
    private String message;
}
