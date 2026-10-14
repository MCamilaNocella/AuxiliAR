package com.auxiliar.server.peer;

/** Who the person would rather talk with */
public enum GenderPreference {
    woman, man, any;

    boolean accepts(Volunteer volunteer) {
        return switch (this) {
            case woman -> volunteer.gender() == Volunteer.Gender.woman;
            case man -> volunteer.gender() == Volunteer.Gender.man;
            case any -> true;
        };
    }
}
