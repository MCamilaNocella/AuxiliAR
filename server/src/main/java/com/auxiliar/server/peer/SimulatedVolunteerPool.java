package com.auxiliar.server.peer;

import java.time.Duration;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.stereotype.Component;

/** Pretend volunteers, while there are no real ones: someone always takes the chat after a few seconds, as the person prefers */
@Component
public class SimulatedVolunteerPool implements VolunteerPool {

    static final List<Volunteer> VOLUNTEERS = List.of(
            new Volunteer("Sofi", "Voluntaria", Volunteer.Gender.woman),
            new Volunteer("Martín", "Voluntario", Volunteer.Gender.man),
            new Volunteer("Caro", "Voluntaria", Volunteer.Gender.woman),
            new Volunteer("Nico", "Voluntario", Volunteer.Gender.man),
            new Volunteer("Juli", "Voluntaria", Volunteer.Gender.woman),
            new Volunteer("Lucas", "Voluntario", Volunteer.Gender.man));

    @Override
    public int available() {
        return ThreadLocalRandom.current().nextInt(2, 6);
    }

    @Override
    public Duration expectedWait() {
        return Duration.ofSeconds(ThreadLocalRandom.current().nextInt(3, 8));
    }

    @Override
    public Optional<Volunteer> assign(GenderPreference preference) {
        List<Volunteer> matching = VOLUNTEERS.stream().filter(preference::accepts).toList();
        return Optional.of(matching.get(ThreadLocalRandom.current().nextInt(matching.size())));
    }
}
