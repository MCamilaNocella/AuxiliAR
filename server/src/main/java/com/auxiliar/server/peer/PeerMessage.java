package com.auxiliar.server.peer;

import java.util.List;

import com.auxiliar.server.chat.ChatResponse;

/**
 * One message of a chat between people, numbered in order (the client asks for the ones after the last it has).
 *
 * @param phones help numbers to show as call buttons under it (only the volunteer's messages have them)
 */
public record PeerMessage(long id, Author author, String text, List<ChatResponse.Phone> phones) {

    public enum Author {
        /** Who asked for help */
        person,
        /** The volunteer */
        volunteer,
        /** The app: someone joined, the chat ended… */
        system
    }
}
