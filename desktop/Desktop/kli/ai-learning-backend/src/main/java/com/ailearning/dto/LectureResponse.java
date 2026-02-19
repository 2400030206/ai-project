package com.ailearning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LectureResponse {
    private String title;
    private List<LectureContentDTO> content;
    private Integer duration;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LectureContentDTO {
        private String heading;
        private String text;
        private String type; // "text" or "whiteboard"
    }
}
