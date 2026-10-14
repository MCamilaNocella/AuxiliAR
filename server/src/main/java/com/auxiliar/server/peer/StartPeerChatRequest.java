package com.auxiliar.server.peer;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import com.auxiliar.server.chat.ChatMessageDto;

/**
 * Asking for a person to talk to.
 *
 * @param nickname how they want to be called (never their real name, unless they choose it)
 * @param sharedWithAuxi the conversation with Auxi, only if they agreed to share it with the volunteer
 * @param preference whether they'd rather talk with a woman or a man (null: either)
 */
public record StartPeerChatRequest(
        @NotBlank @Size(max = 30) String nickname,
        @Size(max = 40) List<@Valid ChatMessageDto> sharedWithAuxi,
        GenderPreference preference) {
}
