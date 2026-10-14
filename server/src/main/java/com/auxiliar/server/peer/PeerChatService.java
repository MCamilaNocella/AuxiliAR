package com.auxiliar.server.peer;

import java.time.Clock;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.auxiliar.server.chat.ChatMessageDto;

/**
 * Chats between a person who needs help and a volunteer. The person's client asks for a chat, then checks every few
 * seconds what's new (that also works once the other side is a real person). Where volunteers come from and who writes
 * their messages are {@link VolunteerPool} and {@link VolunteerResponder}: for now, a simulation and an AI.
 * Chats live in memory and are forgotten after an hour without activity.
 */
@Service
public class PeerChatService {

    private static final Logger log = LoggerFactory.getLogger(PeerChatService.class);

    /** Open chats at the same time, at most */
    static final int MAX_SESSIONS = 200;
    /** A chat with no activity for this long is forgotten */
    static final Duration IDLE_LIMIT = Duration.ofHours(1);
    private static final Duration SWEEP_EVERY = Duration.ofMinutes(5);

    private final VolunteerPool pool;
    private final VolunteerResponder responder;
    private final ScheduledExecutorService scheduler;
    private final Clock clock;
    private final Map<String, PeerSession> sessions = new ConcurrentHashMap<>();

    public PeerChatService(VolunteerPool pool, VolunteerResponder responder, ScheduledExecutorService peerChatScheduler, Clock peerChatClock) {
        this.pool = pool;
        this.responder = responder;
        this.scheduler = peerChatScheduler;
        this.clock = peerChatClock;
        scheduler.scheduleWithFixedDelay(this::forgetIdle, SWEEP_EVERY.toSeconds(), SWEEP_EVERY.toSeconds(), TimeUnit.SECONDS);
    }

    /** Starts looking for a volunteer; the chat opens when one takes it */
    public PeerChatView start(String nickname, List<ChatMessageDto> sharedWithAuxi, GenderPreference preference) {
        if (sessions.size() >= MAX_SESSIONS) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Too many chats open");
        }
        Duration wait = pool.expectedWait();
        PeerSession session = new PeerSession(UUID.randomUUID().toString(), nickname.strip(),
                Objects.requireNonNullElse(sharedWithAuxi, List.of()), pool.available(), wait, clock.instant());
        sessions.put(session.id(), session);
        GenderPreference wanted = Objects.requireNonNullElse(preference, GenderPreference.any);
        scheduler.schedule(() -> connect(session, wanted), wait.toMillis(), TimeUnit.MILLISECONDS);
        return session.view(0);
    }

    /** What's new in the chat after the message `afterId` */
    public PeerChatView view(String id, long afterId) {
        return find(id).view(afterId);
    }

    /** The person writes; the volunteer answers in the background */
    public PeerChatView send(String id, String text, long afterId) {
        PeerSession session = find(id);
        if (!session.addFromPerson(text, clock.instant())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "The chat is not open");
        }
        answer(session);
        return session.view(afterId);
    }

    /** The person leaves */
    public PeerChatView end(String id, long afterId) {
        PeerSession session = find(id);
        session.end(clock.instant());
        return session.view(afterId);
    }

    /**
     * How it went. For now it only goes to the log (a report there is for the team to read); the chat is forgotten.
     * TODO: keep reports in the database once there is a team reviewing them.
     */
    public void feedback(String id, PeerFeedbackRequest feedback) {
        PeerSession session = find(id);
        session.end(clock.instant());
        log.info("Peer chat {} rated {}{}", id, feedback.rating(), feedback.message() == null || feedback.message().isBlank() ? "" : ", with a message");
        if (feedback.report() != null && !feedback.report().isBlank()) {
            log.warn("Peer chat {} reported: {}", id, feedback.report().strip());
        }
        sessions.remove(id);
    }

    private void connect(PeerSession session, GenderPreference preference) {
        boolean connected = pool.assign(preference).map(volunteer -> session.connect(volunteer, clock.instant())).orElse(false);
        if (connected) {
            // The volunteer says hello first
            answer(session);
        } else {
            session.end(clock.instant());
        }
    }

    private void answer(PeerSession session) {
        // A thread of its own: the model takes seconds, and the scheduler only keeps time
        if (session.startAnswer()) {
            Thread.startVirtualThread(() -> writeAnswers(session));
        }
    }

    /** Answers, and again while the person wrote meanwhile */
    private void writeAnswers(PeerSession session) {
        do {
            try {
                session.addFromVolunteer(responder.reply(session.turn()), clock.instant());
            } catch (RuntimeException exception) {
                // The person can write again: the next message gets an answer
                log.error("The volunteer could not answer in chat {}", session.id(), exception);
            }
        } while (session.finishAnswer());
    }

    private PeerSession find(String id) {
        PeerSession session = sessions.get(id);
        if (session == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No such chat");
        }
        return session;
    }

    void forgetIdle() {
        var limit = clock.instant().minus(IDLE_LIMIT);
        sessions.values().removeIf(session -> session.lastActivity().isBefore(limit));
    }

    int openSessions() {
        return sessions.size();
    }
}
