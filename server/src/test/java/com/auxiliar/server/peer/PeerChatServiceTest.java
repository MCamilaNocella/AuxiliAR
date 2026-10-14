package com.auxiliar.server.peer;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.function.BooleanSupplier;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import com.auxiliar.server.chat.ChatMessageDto;

class PeerChatServiceTest {

    private static final Volunteer SOFI = new Volunteer("Sofi", "Voluntaria", Volunteer.Gender.woman);

    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
    /** Every turn the volunteer got, to check what it saw */
    private final List<VolunteerResponder.Turn> turns = new CopyOnWriteArrayList<>();

    @AfterEach
    void stop() {
        scheduler.shutdownNow();
    }

    /** Someone takes the chat right away and answers "Hola, <apodo>" or echoes the last message */
    private PeerChatService service(Optional<Volunteer> volunteer) {
        VolunteerPool pool = new VolunteerPool() {
            @Override
            public int available() {
                return 3;
            }

            @Override
            public Duration expectedWait() {
                return Duration.ZERO;
            }

            @Override
            public Optional<Volunteer> assign(GenderPreference preference) {
                return volunteer;
            }
        };
        VolunteerResponder responder = turn -> {
            turns.add(turn);
            List<PeerMessage> fromPerson = turn.conversation().stream().filter(message -> message.author() == PeerMessage.Author.person).toList();
            String text = fromPerson.isEmpty() ? "Hola, " + turn.nickname() : "Te leí: " + fromPerson.getLast().text();
            // "Nada más": the volunteer says goodbye and closes the chat
            boolean ends = !fromPerson.isEmpty() && fromPerson.getLast().text().equals("Nada más");
            return new VolunteerResponder.Reply(List.of(ends ? "Chau, cuidate" : text), List.of(), false, ends);
        };
        return new PeerChatService(pool, responder, scheduler, Clock.systemUTC());
    }

    private static void await(BooleanSupplier condition) throws InterruptedException {
        for (int tries = 0; tries < 200 && !condition.getAsBoolean(); tries++) {
            Thread.sleep(10);
        }
        assertThat(condition.getAsBoolean()).as("waited 2 s").isTrue();
    }

    private static List<String> texts(PeerChatView view) {
        return view.messages().stream().map(PeerMessage::text).toList();
    }

    @Test
    void startsWaitingThenTheVolunteerJoinsAndSaysHello() throws InterruptedException {
        PeerChatService service = service(Optional.of(SOFI));
        PeerChatView started = service.start(" Luna ", List.of(), null);
        assertThat(started.availableVolunteers()).isEqualTo(3);

        await(() -> service.view(started.id(), 0).messages().size() == 2);
        PeerChatView view = service.view(started.id(), 0);
        assertThat(view.status()).isEqualTo(PeerSession.Status.connected);
        assertThat(view.volunteer()).isEqualTo(SOFI);
        assertThat(texts(view)).containsExactly("Sofi se unió al chat", "Hola, Luna");
        assertThat(view.messages().getFirst().author()).isEqualTo(PeerMessage.Author.system);
    }

    @Test
    void answersEveryMessageAndOnlySendsWhatsNew() throws InterruptedException {
        PeerChatService service = service(Optional.of(SOFI));
        String id = service.start("Luna", List.of(), null).id();
        await(() -> service.view(id, 0).messages().size() == 2);

        PeerChatView sent = service.send(id, "Estoy triste", 2);
        assertThat(texts(sent)).startsWith("Estoy triste");
        await(() -> service.view(id, 2).messages().size() == 2);
        assertThat(texts(service.view(id, 2))).containsExactly("Estoy triste", "Te leí: Estoy triste");
        assertThat(service.view(id, 4).volunteerTyping()).isFalse();
    }

    @Test
    void theVolunteerSeesWhatWasSharedFromAuxi() throws InterruptedException {
        PeerChatService service = service(Optional.of(SOFI));
        List<ChatMessageDto> shared = List.of(new ChatMessageDto(ChatMessageDto.Role.user, "No sé con quién hablar"));
        String id = service.start("Luna", shared, null).id();
        await(() -> !turns.isEmpty());
        assertThat(turns.getFirst().sharedWithAuxi()).isEqualTo(shared);
        assertThat(turns.getFirst().nickname()).isEqualTo("Luna");
        assertThat(id).isNotBlank();
    }

    @Test
    void nobodyToTakeItEndsTheChat() throws InterruptedException {
        PeerChatService service = service(Optional.empty());
        String id = service.start("Luna", List.of(), null).id();
        await(() -> service.view(id, 0).status() == PeerSession.Status.ended);
        assertThatThrownBy(() -> service.send(id, "Hola", 0)).isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void leavingEndsItAndTheFeedbackForgetsIt() throws InterruptedException {
        PeerChatService service = service(Optional.of(SOFI));
        String id = service.start("Luna", List.of(), null).id();
        await(() -> service.view(id, 0).messages().size() == 2);

        PeerChatView ended = service.end(id, 2);
        assertThat(ended.status()).isEqualTo(PeerSession.Status.ended);
        assertThat(texts(ended)).containsExactly("Terminaste el chat con Sofi");
        assertThatThrownBy(() -> service.send(id, "Hola", 0)).isInstanceOf(ResponseStatusException.class);

        service.feedback(id, new PeerFeedbackRequest(PeerFeedbackRequest.Rating.good, null, null));
        assertThatThrownBy(() -> service.view(id, 0)).isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void theVolunteerCanCloseTheChatAndThenNobodyWrites() throws InterruptedException {
        PeerChatService service = service(Optional.of(SOFI));
        String id = service.start("Luna", List.of(), null).id();
        await(() -> service.view(id, 0).messages().size() == 2);

        service.send(id, "Nada más", 2);
        await(() -> service.view(id, 0).status() == PeerSession.Status.ended);
        assertThat(texts(service.view(id, 3))).containsExactly("Chau, cuidate", "Sofi cerró el chat");
        assertThatThrownBy(() -> service.send(id, "Hola", 0)).isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void theSimulatedPoolGivesWhoThePersonPrefers() {
        SimulatedVolunteerPool pool = new SimulatedVolunteerPool();
        for (int tries = 0; tries < 20; tries++) {
            assertThat(pool.assign(GenderPreference.woman).orElseThrow().gender()).isEqualTo(Volunteer.Gender.woman);
            assertThat(pool.assign(GenderPreference.man).orElseThrow().gender()).isEqualTo(Volunteer.Gender.man);
            assertThat(pool.assign(GenderPreference.any)).isPresent();
        }
    }

    @Test
    void anUnknownChatIsNotFound() {
        PeerChatService service = service(Optional.of(SOFI));
        assertThatThrownBy(() -> service.view("nope", 0))
                .isInstanceOfSatisfying(ResponseStatusException.class, exception -> assertThat(exception.getStatusCode().value()).isEqualTo(404));
    }

    @Test
    void chatsWithoutActivityForAnHourAreForgotten() {
        Instant start = Instant.parse("2026-10-14T10:00:00Z");
        Clock[] now = { Clock.fixed(start, ZoneOffset.UTC) };
        Clock clock = new Clock() {
            @Override
            public java.time.ZoneId getZone() {
                return ZoneOffset.UTC;
            }

            @Override
            public Clock withZone(java.time.ZoneId zone) {
                return this;
            }

            @Override
            public Instant instant() {
                return now[0].instant();
            }
        };
        VolunteerPool nobodyYet = new VolunteerPool() {
            @Override
            public int available() {
                return 1;
            }

            @Override
            public Duration expectedWait() {
                return Duration.ofDays(1);
            }

            @Override
            public Optional<Volunteer> assign(GenderPreference preference) {
                return Optional.empty();
            }
        };
        PeerChatService service = new PeerChatService(nobodyYet, turn -> null, scheduler, clock);
        service.start("Luna", List.of(), null);

        now[0] = Clock.fixed(start.plus(Duration.ofMinutes(59)), ZoneOffset.UTC);
        service.forgetIdle();
        assertThat(service.openSessions()).isEqualTo(1);

        now[0] = Clock.fixed(start.plus(Duration.ofMinutes(61)), ZoneOffset.UTC);
        service.forgetIdle();
        assertThat(service.openSessions()).isZero();
    }
}
