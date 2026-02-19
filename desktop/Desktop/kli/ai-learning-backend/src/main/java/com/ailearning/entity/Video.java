package com.ailearning.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "videos")
@Data
public class Video {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private String filename;
    
    @Column(nullable = false)
    private String originalFilename;
    
    @Column(nullable = false)
    private String filePath;
    
    @Column(nullable = false)
    private Long fileSize;
    
    @Column(nullable = false)
    private String language = "en";
    
    @Column(nullable = false)
    private String status = "uploaded"; // uploaded, processing, ready, failed
    
    @Column(nullable = false)
    private LocalDateTime uploadedAt;
    
    @Column
    private LocalDateTime processedAt;
    
    @Column(columnDefinition = "TEXT")
    private String thumbnailPath;
    
    @Column
    private Integer duration; // in seconds
    
    @Column
    private String resolution; // 720p, 1080p, 4K, etc
    
    @Column
    private Double videoQuality; // Rating from 0-5
    
    @Column
    private Integer viewCount = 0;
}
