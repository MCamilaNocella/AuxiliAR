package com.auxiliar.server.chat;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

/**
 * The conversation so far (the client keeps it; the last message is the person's).
 *
 * @param emergency the person pressed "Sí" when asked whether it's an emergency
 * @param profile what's already known about the person (province, locality, age), kept by the client
 */
public record ChatRequest(
        @NotEmpty @Size(max = ChatRequest.MAX_MESSAGES) List<@Valid ChatMessageDto> messages,
        Boolean emergency,
        @Valid ChatProfile profile) {

    public boolean isEmergency() {
        return Boolean.TRUE.equals(emergency);
    }

    static final int MAX_MESSAGES = 40;
}
