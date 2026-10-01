package com.auxiliar.server.chat;

import java.io.Serializable;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonPropertyDescription;

/**
 * What's known about the person and where they are, gathered from the chat (the client keeps it, and later
 * Mi Salud). Any field may be unknown (null).
 *
 * @param person who the age refers to ("vos", "abuelo", "mamá"...)
 */
public record ChatProfile(
        @Size(max = 80) @JsonPropertyDescription("Provincia donde está la persona, si la dijo; null si no se sabe")
        String province,
        @Size(max = 80) @JsonPropertyDescription("Localidad o ciudad donde está la persona, si la dijo; null si no se sabe")
        String locality,
        @Min(0) @Max(130) @JsonPropertyDescription("Edad en años de quien necesita ayuda, solo si alguien la dijo con un número en la conversación; nunca la supongas ni la estimes (\"abuelo\" no dice la edad): si no se dijo, null")
        Integer age,
        @Size(max = 40) @JsonPropertyDescription("De quién es esa edad: «vos» si es quien escribe, o «abuelo», «mamá», etc.; null si no se sabe")
        String person) implements Serializable {

    static final ChatProfile EMPTY = new ChatProfile(null, null, null, null);

    /** Words the model writes when it doesn't know (JSON schemas make it fill every field) */
    private static final java.util.Set<String> UNKNOWN = java.util.Set.of("null", "none", "n/a", "na", "-", "desconocido", "desconocida", "no se sabe", "no sabe", "ninguno", "ninguna");

    /** Unknown is always null: blank text, "null", "desconocido"… or an age of 0 */
    public ChatProfile {
        province = known(province);
        locality = known(locality);
        person = known(person);
        age = age != null && age > 0 ? age : null;
    }

    private static String known(String text) {
        if (text == null || text.isBlank() || UNKNOWN.contains(text.strip().toLowerCase())) {
            return null;
        }
        return text.strip();
    }

    /** This profile updated with what's newly known (unknown fields don't erase known ones) */
    ChatProfile updatedWith(ChatProfile newer) {
        if (newer == null) {
            return this;
        }
        return new ChatProfile(
                pick(newer.province, province),
                pick(newer.locality, locality),
                newer.age != null ? newer.age : age,
                pick(newer.person, person));
    }

    /**
     * Same profile keeping only what someone actually wrote: models tend to guess ("abuelo" → 70 years,
     * nothing said → "Buenos Aires"). A place counts if its words appear in what the person wrote
     * ("CABA" also counts for Ciudad de Buenos Aires); the province, also when it comes from a locality the
     * person wrote ("Balvanera" → CABA); an age, if that number does.
     */
    ChatProfile onlyWhatWasSaid(java.util.List<String> userTexts) {
        String written = normalize(String.join(" ", userTexts.stream().filter(java.util.Objects::nonNull).toList()));
        Integer saidAge = age != null && java.util.regex.Pattern.compile("(?<!\\d)" + age + "(?!\\d)").matcher(written).find() ? age : null;
        String saidLocality = placeIfSaid(locality, written);
        String saidProvince = saidLocality != null ? province : placeIfSaid(province, written);
        return new ChatProfile(saidProvince, saidLocality, saidAge, person);
    }

    private static String placeIfSaid(String place, String written) {
        if (place == null) {
            return null;
        }
        String name = normalize(place);
        boolean said = (" " + written + " ").contains(" " + name + " ")
                || (written.matches(".*\\b(caba|capital federal)\\b.*") && name.contains("buenos aires"));
        return said ? place : null;
    }

    private static String normalize(String text) {
        return java.text.Normalizer.normalize(text, java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "").toLowerCase().replaceAll("[^a-z0-9]+", " ").strip();
    }

    boolean knowsLocation() {
        return province != null && locality != null;
    }

    private static String pick(String newer, String older) {
        return newer != null ? newer : older;
    }
}
