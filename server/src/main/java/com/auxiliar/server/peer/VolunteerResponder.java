package com.auxiliar.server.peer;

import java.util.List;

import com.auxiliar.server.chat.ChatMessageDto;
import com.auxiliar.server.helplines.HelpNumber;

/**
 * Writes the volunteer's side of the chat. For now an AI ({@link AiVolunteer}); with real volunteers this goes away
 * and their messages come in from their own chat screen.
 */
public interface VolunteerResponder {

    /** The volunteer's next messages, answering the conversation so far (with no messages from the person yet: the greeting) */
    Reply reply(Turn turn);

    /**
     * @param nickname how the person wants to be called
     * @param sharedWithAuxi what the person talked about with Auxi, if they agreed to share it (empty otherwise)
     * @param conversation the chat between them so far, oldest first
     */
    record Turn(Volunteer volunteer, String nickname, List<ChatMessageDto> sharedWithAuxi, List<PeerMessage> conversation) {
    }

    /**
     * @param messages one or more chat bubbles, in order
     * @param phones help numbers to show as call buttons under the first one
     * @param endsChat the volunteer says goodbye and closes the chat (the person confirmed there's nothing else)
     */
    record Reply(List<String> messages, List<HelpNumber> phones, boolean emergency, boolean endsChat) {
    }
}
