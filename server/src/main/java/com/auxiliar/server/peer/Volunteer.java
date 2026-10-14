package com.auxiliar.server.peer;

/**
 * Who answers on the other side of a chat between people.
 *
 * @param name the name the person sees ("Sofi")
 * @param role how it's introduced under the name ("Voluntaria", "Voluntario")
 * @param gender for the person who'd rather talk with a woman or a man
 */
public record Volunteer(String name, String role, Gender gender) {

    public enum Gender { woman, man }
}
