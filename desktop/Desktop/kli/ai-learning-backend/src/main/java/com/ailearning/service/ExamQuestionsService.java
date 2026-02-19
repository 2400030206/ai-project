package com.ailearning.service;

import com.ailearning.dto.ExamQuestionsRequest;
import com.ailearning.dto.ExamQuestionsResponse;
import com.ailearning.dto.ExamQuestionsResponse.ExamQuestionDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExamQuestionsService {

    private final Random random = new Random();

    public ExamQuestionsResponse generateExamQuestions(ExamQuestionsRequest request) {
        List<ExamQuestionDTO> questions = new ArrayList<>();

        String[] difficulties = getDifficulties(request.getDifficulty());
        String[] categories = getCategories(request.getCategory());

        // Extract keywords from content for varied explanations
        List<String> keywords = extractKeywords(request.getContent());

        for (int i = 1; i <= request.getCount(); i++) {
            String difficulty = difficulties[(i - 1) % difficulties.length];
            String category = categories[(i - 1) % categories.length];
            
            // Alternate question types: Long answer every 2-3 questions
            String questionType = getQuestionType(i);
            int marks = getMarksForQuestion(questionType, difficulty);

            // Generate varied explanation based on question index
            String explanation = generateVariedExplanation(i, difficulty, category, keywords);
            
            // Generate varied key points based on question index
            List<String> keyPoints = generateVariedKeyPoints(i, category, keywords);

            ExamQuestionDTO question = new ExamQuestionDTO();
            question.setQuestion(generateQuestion(i, category, questionType));
            question.setDifficulty(difficulty);
            question.setCategory(category);
            question.setMarks(marks);
            question.setQuestionType(questionType);
            question.setMarksAllocated(marks);
            question.setExplanation(explanation);
            question.setKeyPoints(keyPoints);

            // For long answer questions, add diagram and 6-mark answer
            if ("long".equals(questionType)) {
                question.setDiagramDescription(generateDiagramDescription(category));
                question.setDiagram(generateDiagram(category));
                question.setAnswer(generateSixMarkAnswer(category, keywords));
            } else {
                question.setAnswer(generateAnswer(questionType, category, keywords));
            }

            questions.add(question);
        }

        log.info("Generated {} exam questions with difficulty: {}", 
            questions.size(), request.getDifficulty());

        return new ExamQuestionsResponse(questions);
    }

    private String generateQuestion(int questionNumber, String category, String questionType) {
        if ("long".equals(questionType)) {
            return "Question " + questionNumber + ": Explain in detail the concept of " + category + 
                   ". Include the theoretical foundation, practical applications, and provide a diagram if applicable. (6 Marks)";
        } else if ("short".equals(questionType)) {
            return "Question " + questionNumber + ": Briefly explain the key aspects of " + category + ". (3 Marks)";
        } else {
            return "Question " + questionNumber + ": What is the main concept of " + category + "? (2 Marks)";
        }
    }

    private String getQuestionType(int questionNumber) {
        // Pattern: Long(1), Short(2), MCQ(3), Long(4), Short(5), MCQ(6)...
        int pattern = questionNumber % 3;
        return switch (pattern) {
            case 1 -> "long";
            case 2 -> "short";
            default -> "mcq";
        };
    }

    private int getMarksForQuestion(String questionType, String difficulty) {
        return switch (questionType) {
            case "long" -> 6;  // Long answer = 6 marks
            case "short" -> 3; // Short answer = 3 marks
            default -> 2;      // MCQ = 2 marks
        };
    }

    private String generateDiagramDescription(String category) {
        return switch (category) {
            case "theory" -> "Conceptual Framework Diagram showing relationship between theoretical components";
            case "application" -> "Process Flow Diagram illustrating how theory is applied in practice";
            case "numerical" -> "Data Representation Diagram showing relationships and calculations";
            case "short" -> "Summary Diagram highlighting key components";
            case "long" -> "Comprehensive System Diagram showing interconnected concepts";
            default -> "Concept Relationship Diagram";
        };
    }

    private String generateDiagram(String category) {
        return switch (category) {
            case "theory" -> "┌─────────────────────────────────┐\n" +
                           "│  THEORETICAL FOUNDATION         │\n" +
                           "└────────────────┬────────────────┘\n" +
                           "                 │\n" +
                           "  ┌──────────────┼──────────────┐\n" +
                           "  │              │              │\n" +
                           "  ▼              ▼              ▼\n" +
                           "Concept    Principles     Rules\n" +
                           "  │              │              │\n" +
                           "  └──────────────┼──────────────┘\n" +
                           "                 │\n" +
                           "┌────────────────▼────────────────┐\n" +
                           "│  PRACTICAL IMPLEMENTATION       │\n" +
                           "└─────────────────────────────────┘";
            case "application" -> "INPUT PHASE\n" +
                                 "    │\n" +
                                 "    ▼\n" +
                                 "┌─────────────────┐\n" +
                                 "│   Processing    │\n" +
                                 "│ - Analysis      │\n" +
                                 "│ - Evaluation    │\n" +
                                 "└────────┬────────┘\n" +
                                 "         │\n" +
                                 "    ┌────▼──────────────┐\n" +
                                 "    │ Learning & Insight│\n" +
                                 "    │ Key Findings      │\n" +
                                 "    └────┬──────────────┘\n" +
                                 "         │\n" +
                                 "         ▼\n" +
                                 "    OUTPUT RESULT";
            case "numerical" -> "┌──────────────┐\n" +
                               "│   Raw Data   │\n" +
                               "└────────┬─────┘\n" +
                               "         │\n" +
                               "    ┌────▼─────┐\n" +
                               "    │Calculation\n" +
                               "    │   Logic   │\n" +
                               "    └────┬──────┘\n" +
                               "         │\n" +
                               "┌────────▼─────────┐\n" +
                               "│  Result Matrix   │\n" +
                               "│  Output Data     │\n" +
                               "└──────────────────┘";
            case "long" -> "┌────────────────────────────┐\n" +
                          "│   COMPREHENSIVE SYSTEM     │\n" +
                          "├──────────┬─────┬──────────┤\n" +
                          "│Module A  │Proc │ Result 1 │\n" +
                          "│Module B  │Step │ Result 2 │\n" +
                          "│Module C  │Flow │ Result 3 │\n" +
                          "└──────────┴─────┴──────────┘";
            default -> "┌──────────────────┐\n" +
                      "│   Key Concept    │\n" +
                      "└────────┬─────────┘\n" +
                      "         │\n" +
                      "┌────────▼────────┐\n" +
                      "│ Sub-concepts    │\n" +
                      "└─────────────────┘";
        };
    }

    private String generateSixMarkAnswer(String category, List<String> keywords) {
        String keyword = !keywords.isEmpty() ? keywords.get(0) : "core concept";
        
        if ("theory".equals(category)) {
            return "1. DEFINITION AND SCOPE (1 mark): Define the concept clearly and establish its boundaries within " + keyword + ".\n" +
                   "2. THEORETICAL FOUNDATION (1 mark): Explain underlying principles and framework including historical development.\n" +
                   "3. KEY COMPONENTS (1 mark): Identify and explain essential components that constitute this concept.\n" +
                   "4. PRINCIPLES AND MECHANISMS (1 mark): Detail working mechanisms explaining how the concept functions in theory.\n" +
                   "5. PRACTICAL APPLICATIONS (1 mark): Provide real-world examples demonstrating relevance and utility.\n" +
                   "6. SIGNIFICANCE AND CONCLUSION (1 mark): Summarize importance and implications in context of " + keyword + ".";
        } else if ("application".equals(category)) {
            return "1. PROBLEM STATEMENT (1 mark): Clearly articulate the problem or situation.\n" +
                   "2. SELECTION OF CONCEPT (1 mark): Explain why this concept is appropriate for solving the problem.\n" +
                   "3. IMPLEMENTATION APPROACH (1 mark): Describe step-by-step how the concept would be implemented.\n" +
                   "4. PRACTICAL METHODOLOGY (1 mark): Detail specific methods and tools, referencing " + keyword + ".\n" +
                   "5. EXPECTED OUTCOMES (1 mark): Explain results expected from applying this concept.\n" +
                   "6. CRITICAL EVALUATION (1 mark): Evaluate effectiveness and suggest improvements or alternatives.";
        } else if ("numerical".equals(category)) {
            return "1. PROBLEM IDENTIFICATION (1 mark): Identify given data, unknowns, and relationships between variables.\n" +
                   "2. FORMULA SELECTION (1 mark): State and justify appropriate formulas or equations.\n" +
                   "3. CALCULATIONS - PART A (1 mark): Show first set of calculations with clear steps.\n" +
                   "4. CALCULATIONS - PART B (1 mark): Complete remaining calculations showing all working and units.\n" +
                   "5. RESULT INTERPRETATION (1 mark): Interpret results in context of " + keyword + ".\n" +
                   "6. VERIFICATION AND CONCLUSION (1 mark): Verify answer and provide conclusive statement with units.";
        } else {
            return "1. INTRODUCTION (1 mark): Introduce the topic and provide context.\n" +
                   "2. MAIN POINT 1 (1 mark): Explain first major aspect of " + keyword + ".\n" +
                   "3. MAIN POINT 2 (1 mark): Elaborate on second significant aspect.\n" +
                   "4. MAIN POINT 3 (1 mark): Discuss third important element.\n" +
                   "5. EXAMPLES AND EVIDENCE (1 mark): Support explanation with relevant examples or evidence.\n" +
                   "6. CONCLUSION (1 mark): Synthesize information and provide comprehensive conclusion.";
        }
    }

    private String generateAnswer(String questionType, String category, List<String> keywords) {
        String keyword = !keywords.isEmpty() ? keywords.get(0) : "concept";
        
        if ("short".equals(questionType)) {
            return "Key aspects of " + category + ": " +
                   "1) Core definition and nature, " +
                   "2) Primary characteristics related to " + keyword + ", " +
                   "3) Main importance and application areas. " +
                   "Brief explanation covering these points with relevant examples.";
        } else {
            return "The main concept of " + category + " refers to " + keyword + 
                   ". This involves understanding fundamental principles and their practical relevance.";
        }
    }

    private String generateVariedExplanation(int questionNumber, String difficulty, String category, List<String> keywords) {
        String[] explanationTemplates = {
            "A comprehensive response demonstrates understanding of the theoretical framework while also showing ability to apply concepts in practical scenarios.",
            "Focus on explaining the underlying principles and mechanisms. Include relevant examples and connect to real-world applications.",
            "Provide a detailed analysis covering both the conceptual foundation and practical implications. Support your answer with evidence and examples.",
            "Emphasize critical thinking and analytical skills. Your answer should show understanding of relationships between different concepts.",
            "Explain the significance and relevance of this topic. Include historical context if applicable and modern-day applications.",
            "Break down complex ideas into simpler components. Show how different parts relate to form a cohesive understanding."
        };

        String baseTemplate = explanationTemplates[questionNumber % explanationTemplates.length];
        
        if (!keywords.isEmpty()) {
            String keyword = keywords.get((questionNumber - 1) % keywords.size());
            return baseTemplate + " Focus particularly on how this relates to: " + keyword + ".";
        }

        return baseTemplate;
    }

    private List<String> generateVariedKeyPoints(int questionNumber, String category, List<String> keywords) {
        List<List<String>> keyPointTemplates = Arrays.asList(
            Arrays.asList(
                "Define the core concept clearly with relevant terminology",
                "Explain its significance and practical applications",
                "Provide concrete examples from your field",
                "Connect with related concepts and theories"
            ),
            Arrays.asList(
                "Identify the main components of this topic",
                "Describe the relationships between different elements",
                "Explain cause-and-effect relationships",
                "Summarize the overall impact and importance"
            ),
            Arrays.asList(
                "Understand the fundamental principles involved",
                "Analyze how these principles work in practice",
                "Compare with alternative approaches or theories",
                "Synthesize information into a coherent explanation"
            ),
            Arrays.asList(
                "State the key assumptions and axioms",
                "Trace the logical progression of ideas",
                "Evaluate the validity and limitations",
                "Apply this knowledge to new scenarios"
            ),
            Arrays.asList(
                "Examine the historical development of this concept",
                "Understand the current state and advancements",
                "Recognize different perspectives and viewpoints",
                "Project future trends and implications"
            ),
            Arrays.asList(
                "Recall foundational knowledge and definitions",
                "Understand how different parts interact",
                "Apply this knowledge to solve problems",
                "Evaluate and critique different approaches"
            )
        );

        List<String> selectedTemplate = keyPointTemplates.get(questionNumber % keyPointTemplates.size());
        
        // Add keyword-specific key point if available
        if (!keywords.isEmpty()) {
            String keyword = keywords.get((questionNumber - 1) % keywords.size());
            List<String> customKeyPoints = new ArrayList<>(selectedTemplate);
            customKeyPoints.set(0, customKeyPoints.get(0) + " (including: " + keyword + ")");
            return customKeyPoints;
        }

        return selectedTemplate;
    }

    private List<String> extractKeywords(String content) {
        if (content == null || content.isEmpty()) {
            return Arrays.asList("concept", "principle", "theory", "application");
        }

        List<String> keywords = new ArrayList<>();
        String[] words = content.toLowerCase().split("\\s+");
        Set<String> uniqueKeywords = new LinkedHashSet<>();

        for (String word : words) {
            String cleanWord = word.replaceAll("[^a-z0-9]", "");
            
            // Extract meaningful words (length > 5, not common)
            if (cleanWord.length() > 5 && !isCommonWord(cleanWord)) {
                uniqueKeywords.add(cleanWord);
                if (uniqueKeywords.size() >= 10) break;
            }
        }

        keywords.addAll(uniqueKeywords);
        return keywords.isEmpty() ? Arrays.asList("concept", "principle", "theory") : keywords;
    }

    private boolean isCommonWord(String word) {
        Set<String> commonWords = new HashSet<>(Arrays.asList(
            "about", "after", "before", "between", "during", "without", "through",
            "because", "would", "could", "should", "people", "these", "those",
            "which", "their", "other", "such", "have", "been", "were", "more"
        ));
        return commonWords.contains(word);
    }

    private String[] getDifficulties(String difficulty) {
        return switch (difficulty) {
            case "easy" -> new String[]{"easy"};
            case "medium" -> new String[]{"medium"};
            case "hard" -> new String[]{"hard"};
            case "mixed" -> new String[]{"easy", "medium", "hard"};
            default -> new String[]{"medium"};
        };
    }

    private String[] getCategories(String category) {
        return switch (category) {
            case "theory" -> new String[]{"theory"};
            case "application" -> new String[]{"application"};
            case "numerical" -> new String[]{"numerical"};
            case "short" -> new String[]{"short"};
            case "long" -> new String[]{"long"};
            case "all" -> new String[]{"theory", "application", "numerical", "short", "long"};
            default -> new String[]{"theory"};
        };
    }

    private int getMarksForDifficulty(String difficulty) {
        return switch (difficulty) {
            case "easy" -> 2;
            case "medium" -> 5;
            case "hard" -> 10;
            default -> 5;
        };
    }
}
