package com.ailearning.service;

import com.ailearning.dto.VideoUploadResponse;
import com.ailearning.entity.Video;
import com.ailearning.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class VideoService {

    private final VideoRepository videoRepository;
    private static final String UPLOAD_DIR = "uploads/videos/";
    private static final long MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
    private static final String[] ALLOWED_EXTENSIONS = {"mp4", "avi", "mov", "mkv", "webm", "flv", "wmv"};

    public VideoUploadResponse uploadVideo(MultipartFile file, String title, String description, String language) throws IOException {
        // Validate file
        validateVideo(file);

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFilename);
        String filename = UUID.randomUUID().toString() + "." + fileExtension;
        String filePath = UPLOAD_DIR + filename;

        // Save file
        Path path = Paths.get(filePath);
        Files.write(path, file.getBytes());

        // Save to database
        Video video = new Video();
        video.setTitle(title != null ? title : originalFilename);
        video.setDescription(description);
        video.setFilename(filename);
        video.setOriginalFilename(originalFilename);
        video.setFilePath(filePath);
        video.setFileSize(file.getSize());
        video.setLanguage(language != null ? language : "en");
        video.setUploadedAt(LocalDateTime.now());
        video.setStatus("uploaded");

        Video savedVideo = videoRepository.save(video);

        log.info("Video uploaded successfully: {} ({})", filename, formatFileSize(file.getSize()));

        return new VideoUploadResponse(
            savedVideo.getId(),
            savedVideo.getTitle(),
            savedVideo.getFilename(),
            savedVideo.getFileSize(),
            formatFileSize(savedVideo.getFileSize()),
            savedVideo.getLanguage(),
            "Video uploaded successfully"
        );
    }

    public Video getVideo(Long id) {
        return videoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Video not found with id: " + id));
    }

    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }

    public List<Video> getVideosByLanguage(String language) {
        return videoRepository.findByLanguage(language);
    }

    public Video updateVideoDetails(Long id, String title, String description) {
        Video video = getVideo(id);
        if (title != null) video.setTitle(title);
        if (description != null) video.setDescription(description);
        return videoRepository.save(video);
    }

    public void deleteVideo(Long id) throws IOException {
        Video video = getVideo(id);
        
        // Delete file from disk
        Path filePath = Paths.get(video.getFilePath());
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }
        
        // Delete from database
        videoRepository.delete(video);
        log.info("Video deleted: {}", video.getFilename());
    }

    public void updateVideoStatus(Long id, String status) {
        Video video = getVideo(id);
        video.setStatus(status);
        videoRepository.save(video);
    }

    private void validateVideo(MultipartFile file) throws IOException {
        // Check file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size of 500MB");
        }

        // Check file extension
        String fileExtension = getFileExtension(file.getOriginalFilename());
        boolean isAllowed = false;
        for (String ext : ALLOWED_EXTENSIONS) {
            if (ext.equalsIgnoreCase(fileExtension)) {
                isAllowed = true;
                break;
            }
        }

        if (!isAllowed) {
            throw new IllegalArgumentException("File type not allowed. Allowed types: " + String.join(", ", ALLOWED_EXTENSIONS));
        }

        // Check if file is empty
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "unknown";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }

    private String formatFileSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        int z = (63 - Long.numberOfLeadingZeros(bytes)) / 10;
        return String.format("%.1f %sB", (double) bytes / (1L << (z * 10)), " KMGTPE".charAt(z));
    }

    public long getTotalStorage() {
        Path uploadPath = Paths.get(UPLOAD_DIR);
        try {
            return Files.walk(uploadPath)
                .map(Path::toFile)
                .mapToLong(File::length)
                .sum();
        } catch (IOException e) {
            log.warn("Could not calculate storage: {}", e.getMessage());
            return 0;
        }
    }

    public long getAvailableStorage() {
        File uploadDir = new File(UPLOAD_DIR);
        return uploadDir.getUsableSpace();
    }
}
