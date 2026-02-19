package com.ailearning.service;

import com.ailearning.dto.ExamSessionRequest;
import com.ailearning.dto.ExamSessionResponse;
import com.ailearning.dto.SubmitExamRequest;
import com.ailearning.dto.ExamResultResponse;
import com.ailearning.entity.Exam;
import com.ailearning.repository.ExamRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExamService {

    private final ExamRepository examRepository;

    public ExamSessionResponse startExamSession(ExamSessionRequest request) {
        String examId = UUID.randomUUID().toString();
        
        // Generate exam questions
        List<Map<String, Object>> questions = new ArrayList<>();
        for (int i = 1; i <= request.getQuestionCount(); i++) {
            questions.add(Map.of(
                "id", "q" + i,
                "question", "Exam Question " + i + ": Explain the concept in detail?",
                "type", "long",
                "marks", 10
            ));
        }

        // Save exam session
        Exam exam = new Exam();
        exam.setExamId(examId);
        exam.setTitle(request.getTitle());
        exam.setDuration(request.getDuration());
        exam.setQuestionCount(request.getQuestionCount());
        exam.setStartTime(LocalDateTime.now());
        examRepository.save(exam);

        log.info("Started exam session: {} with {} questions", examId, questions.size());

        return new ExamSessionResponse(examId, questions, request.getDuration());
    }

    public ExamResultResponse submitExam(SubmitExamRequest request) {
        // Fetch exam from database
        Exam exam = examRepository.findByExamId(request.getExamId())
            .orElseThrow(() -> new RuntimeException("Exam not found"));

        // Calculate score (mock implementation)
        int totalQuestions = exam.getQuestionCount();
        int correctAnswers = (int) (totalQuestions * 0.80); // 80% for demo
        int totalMarks = totalQuestions * 10;
        int obtainedMarks = correctAnswers * 10;
        double percentage = (obtainedMarks * 100.0) / totalMarks;

        // Update exam record
        exam.setEndTime(LocalDateTime.now());
        exam.setScore(obtainedMarks);
        examRepository.save(exam);

        List<Map<String, Object>> results = Arrays.asList(
            Map.of(
                "questionId", "q1",
                "correct", true,
                "marksObtained", 10,
                "feedback", "Excellent answer with good understanding"
            ),
            Map.of(
                "questionId", "q2",
                "correct", false,
                "marksObtained", 6,
                "feedback", "Needs more detailed explanation"
            )
        );

        log.info("Exam submitted: {} with score {}/{}", 
            request.getExamId(), obtainedMarks, totalMarks);

        return new ExamResultResponse(
            request.getExamId(),
            totalMarks,
            obtainedMarks,
            percentage,
            results
        );
    }
}
