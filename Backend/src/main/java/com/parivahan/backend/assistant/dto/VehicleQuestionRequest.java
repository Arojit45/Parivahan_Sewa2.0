package com.parivahan.backend.assistant.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class VehicleQuestionRequest {

    @NotBlank(message = "Message cannot be blank")
    @Size(max = 1000, message = "Message must not exceed 1000 characters")
    private String message;

    /** Optional: conversation history for session context (list of prior exchanges). */
    private java.util.List<ConversationTurn> history;

    @Data
    public static class ConversationTurn {
        private String role;   // "user" or "assistant"
        private String content;
    }
}
