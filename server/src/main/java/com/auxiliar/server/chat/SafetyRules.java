package com.auxiliar.server.chat;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;

import com.auxiliar.server.helplines.HelpNumber;
import com.auxiliar.server.helplines.HelpNumbers;

/**
 * Fixed rules applied after the model answers, so they hold every time:
 * - the conversation is about an older person → PAMI's number is always among the call buttons, plus PAMI's
 *   emergency line when it's an emergency in Rosario or CABA (where it surely applies; Greater Buenos Aires is left
 *   to the model, the exact area isn't confirmed);
 * - it's an emergency and the province, locality or age is unknown → a message asks for them;
 * - Auxi offers to talk with a volunteer but no message asks it → the question, so the buttons answer something.
 */
final class SafetyRules {

    /**
     * PAMI Escucha y Responde: free, 24 h, the whole country (the emergency line depends on the zone, the model picks it).
     * This and the next one are the numbers of two rows of the table of help numbers, which is generated from the verified
     * help lines (client/src/data/resources/lines): {@link #requireNumbers} checks at startup that the rows are there.
     */
    static final String PAMI = "138";
    /** PAMI emergencies, only for members in AMBA and UGL Rosario */
    static final String PAMI_EMERGENCIES = "139";
    static final String THANKS_NOTE = "Gracias, ya lo tengo en cuenta. Seguí las indicaciones de arriba y, si algo cambia, contame.";
    /** The same when it isn't an emergency (there are no instructions above to follow) */
    static final String TELL_ME_MORE_NOTE = "Te leo. Contame un poco más así te ayudo mejor.";
    private static final java.util.List<String> PAMI_EMERGENCY_PLACES = java.util.List.of(
            "rosario", "caba", "ciudad autonoma de buenos aires", "ciudad de buenos aires", "capital federal");

    private SafetyRules() {
    }

    /**
     * The rules below name two rows of the table and assume where the second one works. If the table (generated from the
     * verified lines) stops saying so, the server does not start: better than answering with a number that is wrong.
     */
    static void requireNumbers(HelpNumbers helpNumbers) {
        String problem = rowsProblem(helpNumbers);
        if (problem != null) {
            throw new IllegalStateException(problem);
        }
    }

    /**
     * What is wrong with the rows these rules rely on, or null. It is checked where the table is made (resources:check, which
     * reads this file, and the tests), not when the server starts: a server that does not start answers nobody, and without the
     * PAMI rows the rules only skip PAMI's number (withNumber) and the note falls back to the constant.
     */
    static String rowsProblem(HelpNumbers helpNumbers) {
        if (helpNumbers.find(PAMI).isEmpty()) {
            return "The table of help numbers has no row for " + PAMI + " (PAMI): SafetyRules needs it";
        }
        HelpNumber emergencies = helpNumbers.find(PAMI_EMERGENCIES).orElse(null);
        if (emergencies == null) {
            return "The table of help numbers has no row for " + PAMI_EMERGENCIES + " (PAMI emergencies): SafetyRules needs it";
        }
        String zone = normalize(emergencies.zone());
        if (!zone.contains("amba") || !zone.contains("rosario")) {
            return "SafetyRules assumes that " + PAMI_EMERGENCIES + " is for AMBA and Rosario, and its row says: " + emergencies.zone();
        }
        return null;
    }

    /** Said when the only thing left to say is that PAMI has its own emergency line in the person's zone: the number is the table's */
    static String pamiEmergenciesNote(HelpNumbers helpNumbers) {
        String number = helpNumbers.find(PAMI_EMERGENCIES).map(HelpNumber::number).orElse(PAMI_EMERGENCIES);
        return "Gracias. Si tiene PAMI, en tu zona también podés llamar al " + number + ", la línea de emergencias de PAMI.";
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

    /** Said once in a conversation, in passing, when Auxi decides it's a good moment (no buttons) */
    static final String MENTION_PERSON = "Si en algún momento preferís charlar con una persona, avisame.";

    /** Asked when Auxi offers a volunteer without saying so (the buttons under it answer this) */
    static final String OFFER_PERSON_QUESTION = "¿Querés que te conecte con una persona voluntaria para charlar? Yo sigo acá igual.";

    /**
     * Earlier in the conversation Auxi already offered a volunteer, or they already talked with one (the client leaves a
     * note saying so in Auxi's history when they come back)
     */
    static boolean offeredBefore(List<Message> conversation) {
        // The last message is the person's current one
        List<String> earlier = conversation.stream()
                .limit(Math.max(0, conversation.size() - 1))
                .filter(AssistantMessage.class::isInstance)
                .map(Message::getText)
                .filter(Objects::nonNull)
                .toList();
        return offersPerson(earlier);
    }

    /** A question at the very end, from where its sentence starts ("Lamento eso. ¿Querés contarme más?" → "Lamento eso.") */
    private static final java.util.regex.Pattern CLOSING_QUESTION = java.util.regex.Pattern.compile("(?s)(^|(?<=[.!?\\n]))[^.!?\\n]*\\?\\s*$");

    /** The text without the question it ends with (blank if it was all one question) */
    static String withoutClosingQuestion(String text) {
        return CLOSING_QUESTION.matcher(text).replaceFirst("").strip();
    }

    /** Some bubble already asks whether they want to talk with a volunteer */
    static boolean offersPerson(List<String> replies) {
        return asks(replies, "voluntari[oa]s?|una persona|alguien");
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
