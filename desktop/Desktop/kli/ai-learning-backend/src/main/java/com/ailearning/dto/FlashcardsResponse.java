package com.ailearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlashcardsResponse {
    private List<FlashcardDTO> flashcards;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FlashcardDTO {
        private String question;
        private String answer;
    }
}
