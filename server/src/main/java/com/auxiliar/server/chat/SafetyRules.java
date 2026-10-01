package com.auxiliar.server.chat;

import java.util.ArrayList;
import java.util.List;

import com.auxiliar.server.helplines.HelpNumber;
import com.auxiliar.server.helplines.HelpNumbers;

/**
 * Fixed rules applied after the model answers, so they hold every time:
 * - the conversation is about an older person → PAMI's number is always among the call buttons, plus PAMI's
 *   emergency line when it's an emergency in Rosario or CABA (where it surely applies; Greater Buenos Aires is left
 *   to the model, the exact area isn't confirmed);
 * - it's an emergency and the province, locality or age is unknown → a message asks for them.
 */
final class SafetyRules {

    /** PAMI Escucha y Responde: free, 24 h, the whole country (the emergency 139 depends on the zone, the model picks it) */
    static final String PAMI = "138";
    /** PAMI emergencies, only for members in AMBA and UGL Rosario */
    static final String PAMI_EMERGENCIES = "139";
    static final String PAMI_EMERGENCIES_NOTE = "Gracias. Si tiene PAMI, en tu zona también podés llamar al 139, la línea de emergencias de PAMI.";
    static final String THANKS_NOTE = "Gracias, ya lo tengo en cuenta. Seguí las indicaciones de arriba y, si algo cambia, contame.";
    private static final java.util.List<String> PAMI_EMERGENCY_PLACES = java.util.List.of(
            "rosario", "caba", "ciudad autonoma de buenos aires", "ciudad de buenos aires", "capital federal");

    private SafetyRules() {
    }

    static List<HelpNumber> withPami(List<HelpNumber> phones, HelpNumbers helpNumbers, int max) {
        return withNumber(phones, PAMI, helpNumbers, max);
    }

    /** In an emergency where PAMI has its own line, that one goes first */
    static List<HelpNumber> withPamiEmergencies(List<HelpNumber> phones, ChatProfile profile, HelpNumbers helpNumbers, int max) {
        String place = normalize((profile.locality() == null ? "" : profile.locality()) + " " + (profile.province() == null ? "" : profile.province()));
        boolean covered = PAMI_EMERGENCY_PLACES.stream().anyMatch(place::contains);
        return covered ? withNumber(phones, PAMI_EMERGENCIES, helpNumbers, max) : phones;
    }

    private static List<HelpNumber> withNumber(List<HelpNumber> phones, String number, HelpNumbers helpNumbers, int max) {
        if (phones.stream().anyMatch(line -> line.number().equals(number))) {
            return phones;
        }
        List<HelpNumber> result = new ArrayList<>(phones);
        helpNumbers.find(number).ifPresent(line -> {
            // Room for it: the least important of the model's picks goes
            if (result.size() >= max) {
                result.removeLast();
            }
            result.add(line);
        });
        return List.copyOf(result);
    }

    private static String normalize(String text) {
        return java.text.Normalizer.normalize(text, java.text.Normalizer.Form.NFD).replaceAll("\\p{M}", "").toLowerCase();
    }

    /** Some bubble already asks where they are or the age */
    static boolean asksForData(List<String> replies) {
        return asks(replies, "provincia|localidad|ciudad|barrio|donde (estan|vive|viven|estas)|edad|anos tiene");
    }

    /** Some bubble asks where they are */
    static boolean asksForLocation(List<String> replies) {
        return asks(replies, "provincia|localidad|ciudad|barrio|donde (estan|vive|viven|estas)");
    }

    private static boolean asks(List<String> replies, String topics) {
        return replies.stream().map(SafetyRules::normalize)
                .anyMatch(reply -> reply.contains("?") && reply.matches("(?s).*\\b(" + topics + ")\\b.*"));
    }

    /** The question for whatever is missing, or null if everything is known */
    static String missingDataQuestion(ChatProfile profile) {
        List<String> questions = new ArrayList<>();
        if (profile.province() == null && profile.locality() == null) {
            questions.add("¿en qué provincia y localidad están?");
        } else if (profile.province() == null) {
            questions.add("¿en qué provincia están?");
        } else if (profile.locality() == null) {
            questions.add("¿en qué localidad están?");
        }
        if (profile.age() == null) {
            questions.add("¿qué edad tiene la persona que necesita ayuda?");
        }
        return questions.isEmpty() ? null : "Para ayudarte mejor, contame: " + String.join(" Y ", questions);
    }
}
