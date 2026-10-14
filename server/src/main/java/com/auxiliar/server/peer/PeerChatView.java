package com.auxiliar.server.peer;

import java.util.List;

/**
 * A chat between people as the person's client sees it.
 *
 * @param volunteer who took the chat; null while waiting
 * @param availableVolunteers how many could take it (while waiting)
 * @param estimatedWaitSeconds about how long until someone takes it (while waiting)
 * @param messages the messages after the last one the client already had
 * @param volunteerTyping the volunteer is writing an answer
 */
public record PeerChatView(String id, PeerSession.Status status, Volunteer volunteer, int availableVolunteers,
                           long estimatedWaitSeconds, List<PeerMessage> messages, boolean volunteerTyping) {
}
