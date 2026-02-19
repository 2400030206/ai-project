package com.ailearning.service;

import com.ailearning.dto.LectureRequest;
import com.ailearning.dto.LectureResponse;
import com.ailearning.dto.LectureResponse.LectureContentDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LectureService {

    public LectureResponse generateLecture(LectureRequest request) {
        String title = "Interactive Lecture: " + extractTopicFromContent(request.getContent());
        
        List<LectureContentDTO> contents = Arrays.asList(
            new LectureContentDTO(
                "Introduction",
                "Welcome to this lecture on the topic. We'll explore key concepts, practical applications, and important insights.",
                "text"
            ),
            new LectureContentDTO(
                "Main Concepts",
                "Let's dive into the core principles that form the foundation of this subject matter.",
                "text"
            ),
            new LectureContentDTO(
                "Visual Representation",
                "whiteboard://concept-diagram",
                "whiteboard"
            ),
            new LectureContentDTO(
                "Practical Application",
                "Now let's see how these concepts apply in real-world scenarios.",
                "text"
            ),
            new LectureContentDTO(
                "Summary",
                "To summarize, we've covered the fundamental concepts, their applications, and key takeaways.",
                "text"
            )
        );

        int duration = estimateDuration(contents);

        log.info("Generated lecture with {} sections, estimated {} minutes", 
            contents.size(), duration);

        return new LectureResponse(title, contents, duration);
    }

    private String extractTopicFromContent(String content) {
        String preview = content.substring(0, Math.min(30, content.length()));
        return preview.trim() + "...";
    }

    private int estimateDuration(List<LectureContentDTO> contents) {
        return contents.size() * 3; // 3 minutes per section
    }
}
