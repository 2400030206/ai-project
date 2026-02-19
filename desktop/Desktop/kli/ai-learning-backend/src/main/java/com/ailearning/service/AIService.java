package com.ailearning.service;

import com.ailearning.dto.ExplainRequest;
import com.ailearning.dto.ExplainResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIService {

    public ExplainResponse generateExplanation(ExplainRequest request) {
        String explanation = generateExplanationBasedOnMode(
            request.getContent(),
            request.getMode(),
            request.getLanguage()
        );

        log.info("Generated AI explanation in {} mode", request.getMode());

        return new ExplainResponse(explanation, request.getMode());
    }

    private String generateExplanationBasedOnMode(String content, String mode, String language) {
        // Extract key information from content
        String[] sentences = content.split("[.!?]");
        String[] keywords = extractKeywords(content);
        
        if (sentences.length == 0) {
            return "No content to explain. Please upload a PDF first.";
        }
        
        String mainConcept = keywords.length > 0 ? keywords[0] : "the topic";
        String firstSentence = sentences[0].trim();
        
        return switch (mode) {
            case "simple" -> generateSimpleExplanation(content, keywords, firstSentence, mainConcept);
            case "exam" -> generateExamExplanation(content, keywords, firstSentence, mainConcept);
            case "advanced" -> generateAdvancedExplanation(content, keywords, firstSentence, mainConcept);
            default -> "Explanation for: " + firstSentence + "...";
        };
    }

    private String generateSimpleExplanation(String content, String[] keywords, String firstSentence, String mainConcept) {
        String[] sentences = content.split("[.!?]");
        String[] relevantPoints = extractRelevantPoints(content, 3);
        
        StringBuilder sb = new StringBuilder();
        sb.append("📚 Simple Explanation\n\n");
        sb.append("🎯 Main Concept:\n");
        sb.append(mainConcept.substring(0, 1).toUpperCase()).append(mainConcept.substring(1))
          .append(" is the central idea in this material.\n\n");
        
        sb.append("📖 What it means:\n");
        sb.append(firstSentence).append("\n\n");
        
        sb.append("🔑 Key Points:\n");
        for (int i = 0; i < Math.min(relevantPoints.length, 3); i++) {
            sb.append("• ").append(formatSentenceForDisplay(relevantPoints[i])).append("\n");
        }
        
        sb.append("\n💡 Why it matters:\n");
        sb.append("Understanding ").append(mainConcept).append(" helps you grasp fundamental concepts ")
          .append("and apply them effectively in real-world situations.\n\n");
        
        sb.append("✅ Remember:\n");
        sb.append("• Focus on understanding the basics first\n");
        sb.append("• Try to relate concepts to things you already know\n");
        sb.append("• Practice with examples to strengthen your understanding");
        
        return sb.toString();
    }

    private String generateExamExplanation(String content, String[] keywords, String firstSentence, String mainConcept) {
        String[] sentences = content.split("[.!?]");
        String[] relevantPoints = extractRelevantPoints(content, 4);
        
        StringBuilder sb = new StringBuilder();
        sb.append("🎯 Exam-Level Explanation\n\n");
        sb.append("📌 Topic Overview:\n");
        sb.append(mainConcept.substring(0, 1).toUpperCase()).append(mainConcept.substring(1))
          .append(" is a key concept that frequently appears in exams.\n\n");
        
        sb.append("📝 Definition & Core Concepts:\n");
        sb.append(firstSentence).append("\n\n");
        
        sb.append("⭐ Important Exam Points:\n");
        for (String keyword : Arrays.stream(keywords).limit(3).toArray(String[]::new)) {
            sb.append("• ").append(keyword).append(" - Direct exam relevance (High)\n");
        }
        sb.append("\n");
        
        sb.append("🔍 Key Principles & Applications:\n");
        for (int i = 0; i < Math.min(relevantPoints.length, 3); i++) {
            sb.append(i + 1).append(". ").append(formatSentenceForDisplay(relevantPoints[i])).append("\n");
        }
        
        sb.append("\n💪 Common Exam Patterns:\n");
        sb.append("• Conceptual questions\n");
        sb.append("• Application-based problems\n");
        sb.append("• Comparative analysis\n");
        sb.append("• Critical thinking scenarios\n\n");
        
        sb.append("🎪 Exam Tips:\n");
        sb.append("• Focus on understanding applications and problem-solving approaches\n");
        sb.append("• Practice with previous year exam questions\n");
        sb.append("• Understand the 'why' behind each concept");
        
        return sb.toString();
    }

    private String generateAdvancedExplanation(String content, String[] keywords, String firstSentence, String mainConcept) {
        String[] sentences = content.split("[.!?]");
        String[] relevantPoints = extractRelevantPoints(content, 5);
        
        StringBuilder sb = new StringBuilder();
        sb.append("🧠 Advanced Explanation\n\n");
        sb.append("🔬 Deep Analysis of ").append(mainConcept).append(":\n");
        sb.append(firstSentence).append("\n\n");
        
        sb.append("📊 Theoretical Framework:\n");
        for (String keyword : Arrays.stream(keywords).limit(4).toArray(String[]::new)) {
            sb.append("• ").append(keyword).append("\n");
        }
        sb.append("\n");
        
        sb.append("🏗️ Foundational Concepts:\n");
        for (int i = 0; i < Math.min(relevantPoints.length, 4); i++) {
            sb.append(i + 1).append(". ").append(formatSentenceForDisplay(relevantPoints[i])).append("\n");
        }
        
        sb.append("\n🔗 Interdependencies & Relations:\n");
        sb.append("• Understand how ").append(mainConcept).append(" connects with related concepts\n");
        sb.append("• Analyze cause-effect relationships within the material\n");
        sb.append("• Identify patterns and underlying principles\n\n");
        
        sb.append("🎓 Research Perspectives:\n");
        sb.append("• Current developments and innovations\n");
        sb.append("• Critical analysis and theoretical debates\n");
        sb.append("• Advanced applications in specialized domains\n\n");
        
        sb.append("💡 Advanced Insights:\n");
        sb.append("• Connect this with broader theoretical frameworks\n");
        sb.append("• Consider edge cases and exceptions\n");
        sb.append("• Think about implications and future developments");
        
        return sb.toString();
    }

    private String[] extractKeywords(String content) {
        List<String> keywords = new ArrayList<>();
        String[] words = content.toLowerCase().split("\\s+");
        
        for (String word : words) {
            // Clean punctuation
            word = word.replaceAll("[^a-z0-9]", "");
            
            // Filter by length and common words
            if (word.length() > 5 && !isCommonWord(word)) {
                keywords.add(word);
            }
        }
        
        if (keywords.isEmpty()) {
            return new String[]{"concept", "topic", "subject", "principle", "idea"};
        }
        
        // Return unique keywords, limit to 10
        return keywords.stream()
            .distinct()
            .limit(10)
            .toArray(String[]::new);
    }

    private String[] extractRelevantPoints(String content, int count) {
        String[] sentences = content.split("[.!?]");
        List<String> relevant = new ArrayList<>();
        
        // Filter sentences by relevance (length > 20 chars)
        for (String sentence : sentences) {
            sentence = sentence.trim();
            if (sentence.length() > 20 && sentence.length() < 300) {
                relevant.add(sentence);
            }
        }
        
        // Return requested count
        return relevant.stream()
            .limit(count)
            .toArray(String[]::new);
    }

    private String formatSentenceForDisplay(String sentence) {
        sentence = sentence.trim();
        if (sentence.isEmpty()) {
            return "Key concept discussed in the material";
        }
        
        // Capitalize first letter if not already
        if (Character.isLowerCase(sentence.charAt(0))) {
            sentence = Character.toUpperCase(sentence.charAt(0)) + sentence.substring(1);
        }
        
        // Truncate if too long
        if (sentence.length() > 150) {
            sentence = sentence.substring(0, 150) + "...";
        }
        
        return sentence;
    }
    
    private boolean isCommonWord(String word) {
        List<String> common = Arrays.asList(
            "which", "there", "their", "would", "should", "could", "about", "these", "those",
            "through", "before", "after", "where", "while", "have", "been", "from", "with",
            "that", "this", "and", "the", "are", "was", "for", "but", "not", "you", "all"
        );
        return common.contains(word);
    }

    public String translateIfNeeded(String text, String language) {
        // In production, integrate with translation API
        // For now, return as is
        if ("en".equals(language)) {
            return text;
        }
        return text + "\n\n[Note: Translation to " + language + " would be applied here]";
    }

    // Generate Summary
    public Map<String, Object> generateSummary(String content, String type, String language) {
        String[] sentences = content.split("[.!?]");
        String[] keywords = extractKeywords(content);
        String[] relevantPoints = extractRelevantPoints(content, 5);
        
        Map<String, Object> summary = new LinkedHashMap<>();
        
        String mainConcept = keywords.length > 0 ? keywords[0] : "the topic";
        
        summary.put("title", generateTitle(mainConcept, type));
        summary.put("overview", generateOverview(content, mainConcept, type));
        
        List<String> keyPoints = new ArrayList<>();
        for (String point : relevantPoints) {
            if (!point.trim().isEmpty()) {
                keyPoints.add(formatSentenceForDisplay(point));
            }
        }
        summary.put("keyPoints", keyPoints.stream().limit(5).collect(Collectors.toList()));
        
        summary.put("conclusion", generateConclusion(mainConcept, type));
        summary.put("wordCount", content.split("\\s+").length);
        summary.put("readingTime", estimateReadingTime(content));
        summary.put("type", type);
        
        log.info("Generated {} summary from {} words of content", type, content.split("\\s+").length);
        
        return summary;
    }

    private String generateTitle(String mainConcept, String type) {
        return switch (type) {
            case "concise" -> "Quick Overview: " + capitalizeFirstLetter(mainConcept);
            case "detailed" -> "Comprehensive Guide to " + capitalizeFirstLetter(mainConcept);
            case "bullet-points" -> "Essential Points about " + capitalizeFirstLetter(mainConcept);
            default -> "Summary: " + capitalizeFirstLetter(mainConcept);
        };
    }

    private String generateOverview(String content, String mainConcept, String type) {
        String[] sentences = content.split("[.!?]");
        String firstSentence = sentences.length > 0 ? sentences[0].trim() : "Content overview";
        
        return switch (type) {
            case "concise" -> "A brief overview of " + mainConcept + ": " + firstSentence;
            case "detailed" -> "An in-depth exploration of " + mainConcept + ". " + firstSentence;
            case "bullet-points" -> "Key aspects of " + mainConcept + " in bullet point format";
            default -> firstSentence;
        };
    }

    private String generateConclusion(String mainConcept, String type) {
        return switch (type) {
            case "concise" -> "This summary covers the essentials of " + mainConcept + " for quick reference.";
            case "detailed" -> "This comprehensive guide provides deep insights into " + mainConcept + 
                            " and its various aspects.";
            case "bullet-points" -> "These key points summarize the main aspects of " + mainConcept + 
                                 " for focused learning.";
            default -> "Conclusion about " + mainConcept;
        };
    }

    private Integer estimateReadingTime(String content) {
        // Average reading speed: 200 words per minute
        int wordCount = content.split("\\s+").length;
        return Math.max(1, wordCount / 200);
    }

    private String capitalizeFirstLetter(String text) {
        if (text == null || text.isEmpty()) {
            return text;
        }
        return Character.toUpperCase(text.charAt(0)) + text.substring(1);
    }
}
