package com.ailearning.service;

import com.ailearning.dto.RevisionNotesRequest;
import com.ailearning.dto.RevisionNotesResponse;
import com.ailearning.dto.RevisionNotesResponse.SectionDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RevisionService {

    public RevisionNotesResponse generateRevisionNotes(RevisionNotesRequest request) {
        String title = "Revision Notes: " + extractTopicFromContent(request.getContent());
        
        List<SectionDTO> sections = Arrays.asList(
            new SectionDTO(
                "Key Concepts",
                Arrays.asList(
                    "Fundamental principles and definitions",
                    "Core theories and frameworks",
                    "Essential terminology"
                )
            ),
            new SectionDTO(
                "Important Points to Remember",
                Arrays.asList(
                    "Critical facts and figures",
                    "Common misconceptions to avoid",
                    "Exam-focused highlights"
                )
            ),
            new SectionDTO(
                "Quick Review",
                Arrays.asList(
                    "Main topics covered in the content",
                    "Practical applications",
                    "Key relationships between concepts"
                )
            ),
            new SectionDTO(
                "Practice Questions",
                Arrays.asList(
                    "What are the key concepts?",
                    "How do these principles apply?",
                    "What are the practical implications?"
                )
            )
        );

        List<String> tips = Arrays.asList(
            "Review these notes daily for better retention",
            "Create mind maps to visualize connections",
            "Practice explaining concepts in your own words",
            "Test yourself regularly on key points"
        );

        log.info("Generated revision notes with {} sections", sections.size());

        return new RevisionNotesResponse(title, sections, tips);
    }

    private String extractTopicFromContent(String content) {
        String preview = content.substring(0, Math.min(30, content.length()));
        return preview.trim() + "...";
    }
}
