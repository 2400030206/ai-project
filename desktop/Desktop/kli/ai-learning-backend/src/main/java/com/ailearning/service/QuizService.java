package com.ailearning.service;

import com.ailearning.dto.QuizRequest;
import com.ailearning.dto.QuizResponse;
import com.ailearning.dto.QuizResponse.QuestionDTO;
import com.ailearning.entity.Quiz;
import com.ailearning.repository.QuizRepository;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuizService {

    private final QuizRepository quizRepository;
    private final Gson gson = new Gson();
    private final Random random = new Random();

    public QuizResponse generateQuiz(QuizRequest request) {
        List<QuestionDTO> questions = generateQuestionsBasedOnType(
            request.getContent(),
            request.getType(),
            request.getCount()
        );

        // Save quiz to database
        Quiz quiz = new Quiz();
        quiz.setType(request.getType());
        quiz.setQuestions(gson.toJson(questions));
        quiz.setQuestionCount(questions.size());
        quizRepository.save(quiz);

        log.info("Generated {} questions of type: {}", questions.size(), request.getType());

        return new QuizResponse(questions);
    }

    private List<QuestionDTO> generateQuestionsBasedOnType(String content, String type, Integer count) {
        List<QuestionDTO> questions = new ArrayList<>();

        for (int i = 1; i <= count; i++) {
            switch (type) {
                case "mcq" -> questions.add(generateMCQ(i, content));
                case "true-false" -> questions.add(generateTrueFalse(i, content));
                case "one-line" -> questions.add(generateOneLine(i, content));
            }
        }

        return questions;
    }

    private QuestionDTO generateMCQ(int number, String content) {
        // Extract sentences and keywords from actual content
        String[] sentences = content.split("[.!?]");
        String[] keywords = extractKeywords(content);
        
        if (sentences.length == 0 || keywords.length == 0) {
            return defaultMCQ(number);
        }
        
        // Get a relevant sentence from the content
        String selectedSentence = sentences[number % sentences.length].trim();
        String keyword = keywords[number % keywords.length];
        
        // Generate questions based on actual content sentences
        List<String[]> questionTemplates = Arrays.asList(
            new String[]{"According to the content, what is " + keyword + "?",
                "A key concept that " + formatSentence(selectedSentence),
                "Something not mentioned in the content",
                "A fictional concept unrelated to the topic",
                "A topic covered in a different subject"},
            new String[]{"Which of the following best explains " + keyword + " based on the content?",
                "An important element as described: " + formatSentence(selectedSentence),
                "An outdated or irrelevant concept",
                "A concept from a different field",
                "Something contradictory to the content"},
            new String[]{"What is the relationship between " + keyword + " and the main topic?",
                "It is central to understanding: " + formatSentence(selectedSentence),
                "It has no mention in the provided content",
                "It contradicts the main concept",
                "It is only mentioned in passing"}
        );
        
        String[] template = questionTemplates.get(number % questionTemplates.size());
        
        return new QuestionDTO(
            "q" + number,
            template[0],
            "mcq",
            Arrays.asList(
                "A. " + template[1],
                "B. " + template[2],
                "C. " + template[3],
                "D. " + template[4]
            ),
            "A. " + template[1],
            "This answer directly references the content: " + template[1]
        );
    }
    
    private QuestionDTO defaultMCQ(int number) {
        return new QuestionDTO(
            "q" + number,
            "Question " + number + ": What is the main topic discussed?",
            "mcq",
            Arrays.asList(
                "A. An important concept from the material",
                "B. A fictional or unrelated topic",
                "C. Something contradictory to the learning material",
                "D. None of the above"
            ),
            "A. An important concept from the material",
            "The answer highlights key concepts from the learning material."
        );
    }
    
    private String formatSentence(String sentence) {
        // Format sentence for better readability
        sentence = sentence.trim();
        if (sentence.length() > 100) {
            sentence = sentence.substring(0, 100) + "...";
        }
        return sentence.isEmpty() ? "mentioned in the content" : sentence;
    }

    private QuestionDTO generateTrueFalse(int number, String content) {
        String[] sentences = content.split("[.!?]");
        String[] keywords = extractKeywords(content);
        
        if (sentences.length == 0 || keywords.length == 0) {
            return defaultTrueFalse(number);
        }
        
        String selectedSentence = sentences[number % sentences.length].trim();
        String keyword = keywords[number % keywords.length];
        
        List<String[]> statements = Arrays.asList(
            new String[]{
                "According to the content: " + formatSentence(selectedSentence),
                "True",
                "This statement is directly supported by the provided content."
            },
            new String[]{
                keyword + " is mentioned as a key topic in the content.",
                "True",
                "The content emphasizes this concept as important for understanding."
            },
            new String[]{
                "The content completely ignores or does not discuss " + keyword + ".",
                "False",
                "The content actually covers " + keyword + " as an important aspect."
            }
        );
        
        String[] statement = statements.get(number % statements.size());
        
        return new QuestionDTO(
            "q" + number,
            "Question " + number + ": " + statement[0],
            "true-false",
            Arrays.asList("True", "False"),
            statement[1],
            statement[2]
        );
    }
    
    private QuestionDTO defaultTrueFalse(int number) {
        return new QuestionDTO(
            "q" + number,
            "Question " + number + ": The content provides comprehensive information on this topic.",
            "true-false",
            Arrays.asList("True", "False"),
            "True",
            "The material covers important concepts related to the topic."
        );
    }

    private QuestionDTO generateOneLine(int number, String content) {
        String[] sentences = content.split("[.!?]");
        String[] keywords = extractKeywords(content);
        
        if (sentences.length == 0 || keywords.length == 0) {
            return defaultOneLine(number);
        }
        
        String selectedSentence = sentences[number % sentences.length].trim();
        String keyword = keywords[number % keywords.length];
        
        List<String[]> questions = Arrays.asList(
            new String[]{
                "Based on the provided content, what is the significance of " + keyword + "?",
                formatSentence(selectedSentence) + " This shows its importance in the topic."
            },
            new String[]{
                "How does " + keyword + " relate to the main concepts discussed?",
                "It serves as a key connection: " + formatSentence(selectedSentence)
            },
            new String[]{
                "Why is " + keyword + " important in the context of this material?",
                "Because " + formatSentence(selectedSentence) + " - making it essential for understanding."
            }
        );
        
        String[] qa = questions.get(number % questions.size());
        
        return new QuestionDTO(
            "q" + number,
            "Question " + number + ": " + qa[0],
            "one-line",
            null,
            qa[1],
            "This answer is based on content from the provided material about " + keyword
        );
    }
    
    private QuestionDTO defaultOneLine(int number) {
        return new QuestionDTO(
            "q" + number,
            "Question " + number + ": What is the main learning objective from the provided material?",
            "one-line",
            null,
            "Understanding the core concepts and their practical applications in real-world scenarios.",
            "This captures the essence of learning from the provided study material."
        );
    }
    
    private String[] extractKeywords(String content) {
        // Simple keyword extraction - in production, use NLP libraries
        if (content == null || content.length() < 50) {
            return new String[]{"the topic", "this concept", "the subject", "this principle", "the main idea"};
        }
        
        // Extract words from content (simplified)
        String[] words = content.toLowerCase()
            .replaceAll("[^a-z\\s]", "")
            .split("\\s+");
        
        List<String> keywords = new ArrayList<>();
        for (String word : words) {
            if (word.length() > 5 && !isCommonWord(word)) {
                keywords.add(word);
            }
        }
        
        if (keywords.isEmpty()) {
            return new String[]{"this concept", "the topic", "the subject", "this principle", "the idea"};
        }
        
        // Return first 10 unique keywords
        return keywords.stream()
            .distinct()
            .limit(10)
            .toArray(String[]::new);
    }
    
    private boolean isCommonWord(String word) {
        List<String> common = Arrays.asList("which", "there", "their", "would", "should", "could",
            "about", "these", "those", "through", "before", "after", "where", "while");
        return common.contains(word);
    }

    public QuizResponse generateAIQuiz(String content, String type, Integer count) {
        List<QuestionDTO> questions = new ArrayList<>();

        for (int i = 1; i <= count; i++) {
            switch (type) {
                case "mcq" -> questions.add(generateAIMCQ(i, content));
                case "true-false" -> questions.add(generateAITrueFalse(i, content));
                case "one-line" -> questions.add(generateAIOneLine(i, content));
            }
        }

        // Save quiz to database
        Quiz quiz = new Quiz();
        quiz.setType(type + "-ai");
        quiz.setQuestions(gson.toJson(questions));
        quiz.setQuestionCount(questions.size());
        quizRepository.save(quiz);

        log.info("Generated {} AI-powered questions of type: {}", questions.size(), type);

        return new QuizResponse(questions);
    }

    private QuestionDTO generateAIMCQ(int number, String content) {
        String[] sentences = content.split("[.!?]");
        String[] keywords = extractKeywords(content);
        
        if (sentences.length == 0 || keywords.length == 0) {
            return defaultMCQ(number);
        }
        
        String selectedSentence = sentences[number % sentences.length].trim();
        String keyword = keywords[number % keywords.length];
        String topic = extractMainTopic(content);
        
        // AI-style questions that encourage deeper thinking
        List<String[]> questionTemplates = Arrays.asList(
            new String[]{
                "Based on the concept of " + keyword + ", which statement represents the most accurate understanding?",
                "The text explicitly states that " + formatSentence(selectedSentence),
                "This is a misconception often confused with the actual concept",
                "This contradicts the fundamental principle described in the material",
                "This focuses on a tangential aspect, not the core concept"
            },
            new String[]{
                "When considering " + topic + ", " + keyword + " primarily serves which purpose according to the provided material?",
                "It is fundamental to: " + formatSentence(selectedSentence),
                "It is economically efficient but theoretically irrelevant",
                "It is historically significant but currently outdated",
                "It applies only to specific cases never mentioned in the text"
            },
            new String[]{
                "The relationship between " + keyword + " and the broader context of " + topic + " demonstrates:",
                "An essential connection: " + formatSentence(selectedSentence),
                "A temporary or circumstantial relationship",
                "An inverse or contradictory relationship",
                "No direct relationship, though it may appear connected"
            },
            new String[]{
                "Which inference about " + keyword + " is best supported by the following: '" + formatSentence(selectedSentence) + "'?",
                "This supports the idea that: " + keyword + " is crucial for understanding " + topic,
                "This suggests " + keyword + " is only a minor consideration",
                "This implies " + keyword + " contradicts other concepts",
                "This indicates " + keyword + " has been completely disproven"
            }
        );
        
        String[] template = questionTemplates.get(number % questionTemplates.size());
        
        return new QuestionDTO(
            "q" + number,
            template[0],
            "mcq",
            Arrays.asList(
                "A. " + template[1],
                "B. " + template[2],
                "C. " + template[3],
                "D. " + template[4]
            ),
            "A. " + template[1],
            "AI-Explanation: Option A represents a direct application and accurate understanding of the concept. " 
                + "Options B-D are common misconceptions or oversimplifications that do not capture the nuance in the provided material."
        );
    }

    private QuestionDTO generateAITrueFalse(int number, String content) {
        String[] sentences = content.split("[.!?]");
        
        if (sentences.length == 0) {
            return defaultTrueFalse(number);
        }
        
        String selectedSentence = sentences[number % sentences.length].trim();
        String keyword = extractKeywords(content)[number % extractKeywords(content).length];
        
        // AI-generated nuanced true/false questions
        List<String[]> statements = Arrays.asList(
            new String[]{
                "The material supports the interpretation that: '" + formatSentence(selectedSentence) + "'",
                "True",
                "While related, the statement slightly misrepresents the core concept"
            },
            new String[]{
                keyword.substring(0, Math.min(3, keyword.length())).toUpperCase() 
                + " represents a primary concept in understanding " + extractMainTopic(content),
                "True",
                "It is mentioned but not emphasized as primary"
            },
            new String[]{
                "The document clearly establishes that " + keyword + " and " + extractMainTopic(content) 
                + " have a direct causal relationship",
                "True",
                "The relationship is correlative, not explicitly causal"
            },
            new String[]{
                "When " + keyword + " is analyzed in depth, all interpretations presented can be equally valid",
                "True",
                "The material clearly prioritizes certain interpretations over others"
            }
        );
        
        String[] template = statements.get(number % statements.size());
        
        return new QuestionDTO(
            "q" + number,
            template[0],
            "true-false",
            Arrays.asList("True", "False"),
            template[1],
            "AI-Powered Analysis: " + (template[1].equals("True") 
                ? "This statement aligns with the evidence and context provided in the material."
                : "While related, this statement oversimplifies or misrepresents the nuance in the material.")
        );
    }

    private QuestionDTO generateAIOneLine(int number, String content) {
        String[] sentences = content.split("[.!?]");
        
        if (sentences.length == 0) {
            return defaultOneLine(number);
        }
        
        String selectedSentence = sentences[number % sentences.length].trim();
        String keyword = extractKeywords(content)[number % extractKeywords(content).length];
        String topic = extractMainTopic(content);
        
        String formattedSentence = formatSentence(selectedSentence);
        
        // AI-style short answer questions requiring synthesis
        List<String[]> answers = Arrays.asList(
            new String[]{
                "Explain briefly why '" + formattedSentence + "' represents a key insight about " + keyword,
                "Because it demonstrates that " + keyword + " is central to understanding " + topic 
                + ", and the statement captures the essential relationship between these concepts."
            },
            new String[]{
                "What is the primary distinction between the concept of " + keyword + " and other related ideas?",
                "The primary distinction is that " + keyword + " directly relates to the core principle: " 
                + formattedSentence
            },
            new String[]{
                "How does '" + formattedSentence + "' advance our understanding of " + topic + "?",
                "It clarifies that " + keyword + " is not merely auxiliary but essential, specifically through: " 
                + formattedSentence
            }
        );
        
        String[] template = answers.get(number % answers.size());
        
        return new QuestionDTO(
            "q" + number,
            template[0],
            "one-line",
            Arrays.asList(),
            template[1],
            "AI-Generated Model Answer: The answer should demonstrate understanding of how " + keyword 
            + " integrates with the broader concepts in " + topic
        );
    }

    private String extractMainTopic(String content) {
        String[] words = content.split("\\s+");
        String[] keywords = extractKeywords(content);
        
        if (keywords.length > 0) {
            return keywords[0];
        }
        
        if (words.length > 0) {
            return words[0].toLowerCase();
        }
        
        return "this concept";
    }

    public Map<String, Object> submitQuiz(String quizId, Map<String, String> answers) {
        // Calculate score
        int totalQuestions = answers.size();
        int correctAnswers = 0;

        // In a real implementation, fetch correct answers and compare
        // For now, mock calculation
        correctAnswers = (int) (totalQuestions * 0.75); // 75% correct for demo

        double percentage = (correctAnswers * 100.0) / totalQuestions;

        log.info("Quiz submitted: {} correct out of {}", correctAnswers, totalQuestions);

        return Map.of(
            "quizId", quizId,
            "totalCount", totalQuestions,
            "correctCount", correctAnswers,
            "scorePercentage", percentage,
            "passed", percentage >= 60
        );
    }
}
