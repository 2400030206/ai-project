package com.ailearning.service;

import com.ailearning.dto.SmartSummaryRequest;
import com.ailearning.dto.SmartSummaryResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SummaryService {

    private final AIService aiService;

    public SmartSummaryResponse generateSummary(SmartSummaryRequest request) {
        String content = request.getContent();
        String type = request.getType();
        String language = request.getLanguage() != null ? request.getLanguage() : "en";

        // Use AIService to generate smart summary
        Map<String, Object> aiSummary = aiService.generateSummary(content, type, language);

        log.info("Generated {} summary from AI service", type);

        return new SmartSummaryResponse(
            (String) aiSummary.get("title"),
            (String) aiSummary.get("overview"),
            ((List<?>) aiSummary.get("keyPoints")).stream()
                .map(Object::toString)
                .collect(Collectors.toList()),
            extractTopics(content),
            (String) aiSummary.get("conclusion"),
            (Integer) aiSummary.get("wordCount"),
            (Integer) aiSummary.get("readingTime")
        );
    }

    private List<String> extractTopics(String content) {
        return Arrays.asList(
            "Core Concepts",
            "Practical Applications",
            "Theoretical Framework",
            "Key Definitions"
        );
    }
}
