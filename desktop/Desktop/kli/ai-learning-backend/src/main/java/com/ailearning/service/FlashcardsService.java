package com.ailearning.service;

import com.ailearning.dto.FlashcardsRequest;
import com.ailearning.dto.FlashcardsResponse;
import com.ailearning.dto.FlashcardsResponse.FlashcardDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FlashcardsService {

    public FlashcardsResponse generateFlashcards(FlashcardsRequest request) {
        List<FlashcardDTO> flashcards = new ArrayList<>();

        for (int i = 1; i <= request.getCount(); i++) {
            flashcards.add(new FlashcardDTO(
                "What is concept #" + i + " in this topic?",
                "Concept #" + i + " refers to the fundamental principle that explains key aspects of the subject matter, providing essential understanding for learners."
            ));
        }

        log.info("Generated {} flashcards", flashcards.size());

        return new FlashcardsResponse(flashcards);
    }
}
