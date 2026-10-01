package com.auxiliar.server.chat;

import java.util.List;

/**
 * Auxi's answer, plus links to the AuxiliAR pages it suggests.
 *
 * @param replies the answer as one or more chat bubbles, in order
 * @param emergency Auxi considers it an emergency
 * @param phones help numbers to show as call buttons, chosen by Auxi for this situation
 * @param profile what's known about the person so far, for the client to keep (and Mi Salud)
 * @param asksLocation the answer asks where they are: the client suggests localities as they type
 */
public record ChatResponse(List<String> replies, List<Link> links, boolean emergency, List<Phone> phones,
                           ChatProfile profile, boolean asksLocation) {

    public record Link(String title, String path) {
    }

    /** A call button: the number to dial and its short name */
    public record Phone(String number, String label) {
    }
}
