package com.auxiliar.server.chat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** One message of the conversation, as the client sends it */
public record ChatMessageDto(
        @NotNull Role role,
        @NotBlank @Size(max = ChatMessageDto.MAX_TEXT_LENGTH) String text) {

    static final int MAX_TEXT_LENGTH = 2000;

    public enum Role { user, assistant }
}
