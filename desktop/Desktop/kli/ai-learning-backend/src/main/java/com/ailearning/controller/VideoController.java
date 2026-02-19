package com.ailearning.controller;

import com.ailearning.dto.VideoUploadResponse;
import com.ailearning.entity.Video;
import com.ailearning.service.VideoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class VideoController {

    private final VideoService videoService;

    @PostMapping("/upload")
    public ResponseEntity<VideoUploadResponse> uploadVideo(
            @RequestParam MultipartFile file,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false, defaultValue = "en") String language) {
        try {
            VideoUploadResponse response = videoService.uploadVideo(file, title, description, language);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            log.error("Failed to upload video: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                new VideoUploadResponse(null, null, null, 0L, null, language, "Failed to upload video: " + e.getMessage())
            );
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Video> getVideo(@PathVariable Long id) {
        try {
            Video video = videoService.getVideo(id);
            return ResponseEntity.ok(video);
        } catch (Exception e) {
            log.error("Video not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Video>> getAllVideos() {
        List<Video> videos = videoService.getAllVideos();
        return ResponseEntity.ok(videos);
    }

    @GetMapping("/language/{language}")
    public ResponseEntity<List<Video>> getVideosByLanguage(@PathVariable String language) {
        List<Video> videos = videoService.getVideosByLanguage(language);
        return ResponseEntity.ok(videos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Video> updateVideoDetails(
            @PathVariable Long id,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description) {
        try {
            Video video = videoService.updateVideoDetails(id, title, description);
            return ResponseEntity.ok(video);
        } catch (Exception e) {
            log.error("Failed to update video: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateVideoStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            videoService.updateVideoStatus(id, status);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Failed to update video status: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVideo(@PathVariable Long id) {
        try {
            videoService.deleteVideo(id);
            return ResponseEntity.ok().build();
        } catch (IOException e) {
            log.error("Failed to delete video: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/storage/total")
    public ResponseEntity<Long> getTotalStorage() {
        return ResponseEntity.ok(videoService.getTotalStorage());
    }

    @GetMapping("/storage/available")
    public ResponseEntity<Long> getAvailableStorage() {
        return ResponseEntity.ok(videoService.getAvailableStorage());
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("✓ Video service is running");
    }
}
