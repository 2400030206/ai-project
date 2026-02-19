package com.ailearning;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class AiLearningApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiLearningApplication.class, args);
        System.out.println("🚀 AI Learning Backend is running on http://localhost:8080");
    }
}
