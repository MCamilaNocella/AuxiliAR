package com.auxiliar.server.peer;

import jakarta.validation.constraints.Size;

/**
 * How the chat went, after it ended. Everything is optional.
 *
 * @param message a few words for the volunteer
 * @param report something wrong that happened in the chat, for the AuxiliAR team
 */
public record PeerFeedbackRequest(Rating rating, @Size(max = 500) String message, @Size(max = 1000) String report) {

    public enum Rating { bad, okay, good }
}
