package com.ailearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevisionNotesResponse {
    private String title;
    private List<SectionDTO> sections;
    private List<String> tips;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SectionDTO {
        private String heading;
        private List<String> points;
    }
}
