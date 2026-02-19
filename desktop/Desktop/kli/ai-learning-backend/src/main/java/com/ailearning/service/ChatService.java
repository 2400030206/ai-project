package com.ailearning.service;

import com.ailearning.dto.ChatRequest;
import com.ailearning.dto.ChatResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final Random random = new Random();

    public ChatResponse answerQuestion(ChatRequest request) {
        String message = request.getMessage().toLowerCase().trim();
        String topic = request.getTopic() != null ? request.getTopic() : "general";
        String difficulty = request.getDifficulty() != null ? request.getDifficulty() : "intermediate";

        ChatResponse response = new ChatResponse();
        
        // Generate response based on question
        String answer = generateAnswer(message, topic, difficulty);
        response.setResponse(answer);
        
        // Generate explanation
        response.setExplanation(generateExplanation(message, topic));
        
        // Generate key points
        response.setKeyPoints(generateKeyPoints(message, topic));
        
        // Generate diagram if applicable
        if (needsDiagram(message)) {
            response.setDiagram(generateDiagram(message, topic));
            response.setHasVisualAid(true);
        } else {
            response.setHasVisualAid(false);
        }
        
        // Suggest related topics
        response.setRelatedTopics(generateRelatedTopics(topic));

        log.info("Chat response generated for question: {}", message);
        return response;
    }

    private String generateAnswer(String question, String topic, String difficulty) {
        // Detect question type and generate appropriate answer
        if (question.contains("what") || question.contains("define") || question.contains("meaning")) {
            return generateDefinitionAnswer(question, topic, difficulty);
        } else if (question.contains("how") || question.contains("explain") || question.contains("process")) {
            return generateExplanationAnswer(question, topic, difficulty);
        } else if (question.contains("why") || question.contains("important") || question.contains("significance")) {
            return generateSignificanceAnswer(question, topic, difficulty);
        } else if (question.contains("example") || question.contains("instance")) {
            return generateExampleAnswer(question, topic);
        } else if (question.contains("difference") || question.contains("compare")) {
            return generateComparisonAnswer(question, topic);
        } else {
            return generateGeneralAnswer(question, topic);
        }
    }

    private String generateDefinitionAnswer(String question, String topic, String difficulty) {
        String[] responses = {
            "In the context of " + topic + ", this term refers to a fundamental concept that encompasses " +
                    "specific characteristics and properties. The core definition includes understanding its scope, " +
                    "components, and real-world applications. For a " + difficulty + " level understanding, focus on " +
                    "the essential features and how it connects to broader concepts in " + topic + ".",
            
            extractKeyword(question) + " in " + topic + " is defined as a structured concept involving multiple " +
                    "interconnected elements. Understanding this requires knowledge of its theoretical foundation, practical " +
                    "implementation, and relevance in modern applications of " + topic + ".",
            
            "The concept of " + extractKeyword(question) + " represents a key principle in " + topic + ". It involves " +
                    "understanding how different components work together to create a cohesive system. At the " + difficulty + 
                    " level, you should grasp both the theoretical framework and practical implications."
        };
        return responses[random.nextInt(responses.length)];
    }

    private String generateExplanationAnswer(String question, String topic, String difficulty) {
        String[] responses = {
            "To understand this process, follow these steps:\n" +
                    "1. Understand the foundational concepts in " + topic + "\n" +
                    "2. Learn how each component interacts with others\n" +
                    "3. Study real-world examples and case studies\n" +
                    "4. Practice applying the concept to different scenarios\n" +
                    "This systematic approach ensures comprehensive understanding at the " + difficulty + " level.",
            
            "The process works through a series of interconnected phases:\n" +
                    "Phase 1: Initial concept formation and understanding of basic principles\n" +
                    "Phase 2: Application of theory to practical scenarios\n" +
                    "Phase 3: Integration with related concepts in " + topic + "\n" +
                    "Phase 4: Advanced analysis and critical evaluation\n" +
                    "Each phase builds upon the previous, creating deeper understanding.",
            
            "Here's how this concept operates in " + topic + ":\n" +
                    "- It begins with fundamental principles that serve as the foundation\n" +
                    "- These principles interact through various mechanisms and relationships\n" +
                    "- The resulting system demonstrates emergence of complex behaviors\n" +
                    "- Understanding requires both theoretical knowledge and practical experience\n" +
                    "For " + difficulty + " learners, focus on grasping the main flow first, then dive into details."
        };
        return responses[random.nextInt(responses.length)];
    }

    private String generateSignificanceAnswer(String question, String topic, String difficulty) {
        String[] responses = {
            "This concept is significant in " + topic + " because it provides a framework for understanding " +
                    "complex phenomena and solving practical problems. Its importance lies in how it connects " +
                    "theoretical knowledge with real-world applications. For " + difficulty + " learners, understanding " +
                    "its significance helps in solving more complex problems and making informed decisions.",
            
            "The importance of this concept in " + topic + " cannot be overstated. It serves as a cornerstone " +
                    "for understanding advanced topics and is essential for professional practice. Its relevance extends " +
                    "across multiple domains and remains crucial in contemporary research and applications.",
            
            "Understanding why this matters in " + topic + " helps you:\n" +
                    "- Develop deeper insights into the subject\n" +
                    "- Connect disparate concepts into a coherent framework\n" +
                    "- Apply knowledge to solve real-world problems\n" +
                    "- Progress to more advanced topics with confidence\n" +
                    "At the " + difficulty + " level, grasp how this supports your learning journey."
        };
        return responses[random.nextInt(responses.length)];
    }

    private String generateExampleAnswer(String question, String topic) {
        String[] examples = {
            "Consider a real-world scenario in " + topic + ": Imagine a practical situation where you need to apply " +
                    "this concept. For instance, in a professional context, this would manifest as specific behaviors or outcomes. " +
                    "By analyzing this example, you can understand how theory translates into practice.",
            
            "A practical example of this in " + topic + " includes:\n" +
                    "Scenario: A real-world application where this concept plays a crucial role\n" +
                    "Context: The specific conditions and constraints of this situation\n" +
                    "Application: How the concept is implemented in this context\n" +
                    "Outcome: The results and implications of this application\n" +
                    "This example demonstrates the practical value of understanding this concept.",
            
            "In the field of " + topic + ", a common example is when professionals need to address a specific challenge " +
                    "using the principles we've discussed. The example shows how theoretical knowledge becomes practical wisdom " +
                    "through experience and application."
        };
        return examples[random.nextInt(examples.length)];
    }

    private String generateComparisonAnswer(String question, String topic) {
        String[] comparisons = {
            "When comparing these concepts in " + topic + ":\n" +
                    "Similarities: Both concepts share foundational principles and serve important roles\n" +
                    "Differences: They have distinct characteristics and application contexts\n" +
                    "When to use each: Understanding when to apply each concept is crucial for success in " + topic + ".\n" +
                    "This comparison helps clarify your understanding and improves decision-making.",
            
            "A comparison in " + topic + " reveals:\n" +
                    "Aspect 1: How they differ in scope and application\n" +
                    "Aspect 2: Their relative strengths and limitations\n" +
                    "Aspect 3: Which is more suitable for different scenarios\n" +
                    "Understanding these distinctions prevents confusion and enables better problem-solving.",
            
            "To compare these concepts effectively in " + topic + ":\n" +
                    "- Identify core principles of each\n" +
                    "- Analyze their relationships and interactions\n" +
                    "- Study examples where each applies\n" +
                    "- Evaluate their strengths and weaknesses\n" +
                    "This structured approach ensures comprehensive understanding."
        };
        return comparisons[random.nextInt(comparisons.length)];
    }

    private String generateGeneralAnswer(String question, String topic) {
        String[] generalAnswers = {
            "In the context of " + topic + ", this is an important aspect worth exploring. The question touches on " +
                    "multiple dimensions including theoretical understanding, practical application, and critical analysis. " +
                    "To fully address this, consider how it relates to your current level of understanding and what specific " +
                    "aspects you'd like to focus on.",
            
            "This question about " + topic + " invites deeper engagement with the subject matter. Key points to consider:\n" +
                    "- Theoretical framework and fundamental principles\n" +
                    "- Historical development and evolution of ideas\n" +
                    "- Contemporary applications and relevance\n" +
                    "- Future perspectives and emerging trends\n" +
                    "Exploring these dimensions will enhance your understanding considerably.",
            
            "Addressing this question requires understanding " + topic + " from multiple perspectives. Consider:\n" +
                    "- What foundational knowledge is needed?\n" +
                    "- How does this connect to other concepts?\n" +
                    "- What practical examples are relevant?\n" +
                    "- How can you apply this knowledge effectively?\n" +
                    "This holistic approach supports comprehensive learning."
        };
        return generalAnswers[random.nextInt(generalAnswers.length)];
    }

    private String generateExplanation(String question, String topic) {
        String[] explanations = {
            "This explanation is grounded in the fundamental principles of " + topic + ". Understanding requires " +
                    "recognizing how individual components work together to form a cohesive system. Each element plays " +
                    "a specific role and contributes to the overall functioning of the concept.",
            
            "The deeper explanation involves understanding the mechanisms, relationships, and implications within " + 
                    topic + ". This goes beyond surface-level knowledge to encompass the 'why' and 'how' questions that " +
                    "drive meaningful learning and application.",
            
            "A comprehensive explanation includes both the 'what' (definition and scope) and the 'why' (significance " +
                    "and implications). In " + topic + ", these elements combine to create a rich understanding that supports " +
                    "further learning and professional application."
        };
        return explanations[random.nextInt(explanations.length)];
    }

    private List<String> generateKeyPoints(String question, String topic) {
        List<String> keyPoints = new ArrayList<>();
        keyPoints.add("Understand the foundational concepts and definitions in " + topic);
        keyPoints.add("Recognize how different components interact and relate to each other");
        keyPoints.add("Study practical examples and real-world applications");
        keyPoints.add("Connect this knowledge to broader concepts in your learning journey");
        keyPoints.add("Practice applying concepts to solve problems or answer questions");
        keyPoints.add("Engage in critical thinking about implications and future applications");
        
        // Shuffle and return first 4-5 key points
        Collections.shuffle(keyPoints);
        return keyPoints.subList(0, Math.min(5, keyPoints.size()));
    }

    private boolean needsDiagram(String question) {
        String[] keywords = {"diagram", "structure", "flow", "process", "system", "relationship", 
                            "hierarchy", "framework", "model", "cycle", "sequence", "components"};
        for (String keyword : keywords) {
            if (question.contains(keyword)) {
                return true;
            }
        }
        return random.nextDouble() < 0.3; // 30% chance for other questions
    }

    private String generateDiagram(String question, String topic) {
        return "CONCEPT VISUALIZATION FOR " + topic.toUpperCase() + "\n" +
               "┌─────────────────────────────────────┐\n" +
               "│     CENTRAL CONCEPT                 │\n" +
               "└──────────────┬──────────────────────┘\n" +
               "               │\n" +
               "      ┌────────┼────────┐\n" +
               "      │        │        │\n" +
               "      ▼        ▼        ▼\n" +
               "   Element  Element  Element\n" +
               "      A        B        C\n" +
               "      │        │        │\n" +
               "      └────────┼────────┘\n" +
               "               │\n" +
               "      ┌────────▼────────┐\n" +
               "      │   APPLICATION   │\n" +
               "      │   & OUTCOMES    │\n" +
               "      └─────────────────┘\n\n" +
               "This diagram shows how the central concept breaks down into key components\n" +
               "and how they come together to create practical applications.";
    }

    private String generateRelatedTopics(String topic) {
        Map<String, String[]> relatedMap = new HashMap<>();
        relatedMap.put("mathematics", new String[]{"algebra", "geometry", "calculus", "statistics"});
        relatedMap.put("science", new String[]{"physics", "chemistry", "biology", "earth science"});
        relatedMap.put("history", new String[]{"world history", "ancient civilizations", "modern history", "social movements"});
        relatedMap.put("literature", new String[]{"poetry", "fiction", "drama", "literary criticism"});
        relatedMap.put("general", new String[]{"foundational concepts", "advanced applications", "historical context", "practical examples"});

        String[] topics = relatedMap.getOrDefault(topic.toLowerCase(), relatedMap.get("general"));
        return "Explore these related topics: " + String.join(", ", Arrays.copyOf(topics, Math.min(3, topics.length)));
    }

    private String extractKeyword(String text) {
        // Simple keyword extraction - get the last meaningful word
        String[] words = text.split("\\s+");
        for (int i = words.length - 1; i >= 0; i--) {
            String word = words[i].replaceAll("[?.]", "").toLowerCase();
            if (word.length() > 3 && !isCommonWord(word)) {
                return word;
            }
        }
        return "concept";
    }

    private boolean isCommonWord(String word) {
        Set<String> commonWords = new HashSet<>(Arrays.asList(
            "the", "what", "when", "where", "why", "how", "is", "are", "was", "were",
            "about", "after", "before", "can", "could", "should", "would", "this", "that"
        ));
        return commonWords.contains(word);
    }
}
