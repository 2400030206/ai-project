package com.ailearning.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "exams")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Exam {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "exam_id", unique = true, nullable = false)
    private String examId;
    
    @Column
    private String title;
    
    @Column
    private Integer duration;
    
    @Column(name = "question_count")
    private Integer questionCount;
    
    @Column(columnDefinition = "TEXT")
    private String questions;
    
    @Column(columnDefinition = "TEXT")
    private String answers;
    
    @Column
    private Integer score;
    
    @Column(name = "total_questions")
    private Integer totalQuestions;
    
    @Column
    private String status;
    
    @Column(name = "start_time")
    private LocalDateTime startTime;
    
    @Column(name = "end_time")
    private LocalDateTime endTime;
    
    @CreationTimestamp
    @Column(name = "started_at", updatable = false)
    private LocalDateTime startedAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "user_id")
    private Long userId;
}
