package com.auxiliar.server.chat;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * One answer while completing the Mi Salud profile with Auxi.
 *
 * @param field the piece of data being asked
 * @param messages the exchange about that piece of data: Auxi's question, the person's answer and, if Auxi had to
 *                 ask again, the following ones (the last message is the person's)
 */
public record ProfileAnswerRequest(
        @NotNull ProfileField field,
        @NotEmpty @Size(max = ProfileAnswerRequest.MAX_MESSAGES) List<@Valid ChatMessageDto> messages) {

    static final int MAX_MESSAGES = 12;
}
