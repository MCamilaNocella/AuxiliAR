package com.auxiliar.server.peer;

import java.time.Duration;
import java.util.Optional;

/**
 * Where volunteers come from. For now {@link SimulatedVolunteerPool}; with real volunteers, the ones
 * who are available in their help panel.
 */
public interface VolunteerPool {

    /** How many could take a chat right now (shown while waiting) */
    int available();

    /** About how long until someone takes it */
    Duration expectedWait();

    /** Someone to take a chat that has waited {@link #expectedWait()}, as the person prefers; empty if nobody did */
    Optional<Volunteer> assign(GenderPreference preference);
}
