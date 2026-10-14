package com.auxiliar.server.peer;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.auxiliar.server.chat.ChatMessageDto;
import com.auxiliar.server.chat.ChatResponse;

/**
 * One chat between a person and a volunteer, kept on the server (the source of truth, as a real chat needs).
 * Every method is synchronized: the person's requests and the volunteer's answers arrive on different threads.
 */
public final class PeerSession {

    public enum Status {
        /** Looking for someone */
        waiting,
        /** A volunteer took it */
        connected,
        /** Someone left, or nobody was found */
        ended
    }

    /** Messages in one chat, at most (the person's and the volunteer's) */
    static final int MAX_MESSAGES = 120;

    private final String id;
    private final String nickname;
    private final List<ChatMessageDto> sharedWithAuxi;
    private final int availableVolunteers;
    private final Duration expectedWait;
    private final List<PeerMessage> messages = new ArrayList<>();
    private Status status = Status.waiting;
    private Volunteer volunteer;
    private Instant lastActivity;
    private long lastId;
    /** The volunteer is writing an answer */
    private boolean answering;
    /** The person wrote again while the volunteer was answering: one more answer when it's done */
    private boolean answerPending;

    PeerSession(String id, String nickname, List<ChatMessageDto> sharedWithAuxi, int availableVolunteers, Duration expectedWait, Instant now) {
        this.id = id;
        this.nickname = nickname;
        this.sharedWithAuxi = List.copyOf(sharedWithAuxi);
        this.availableVolunteers = availableVolunteers;
        this.expectedWait = expectedWait;
        this.lastActivity = now;
    }

    String id() {
        return id;
    }

    synchronized Status status() {
        return status;
    }

    synchronized Instant lastActivity() {
        return lastActivity;
    }

    /** The volunteer took the chat: it says so in the chat */
    synchronized boolean connect(Volunteer taken, Instant now) {
        if (status != Status.waiting) {
            return false;
        }
        volunteer = taken;
        status = Status.connected;
        lastActivity = now;
        add(PeerMessage.Author.system, taken.name() + " se unió al chat", List.of());
        return true;
    }

    /** Nobody took it, or the person left: it says so in the chat if someone was there */
    synchronized void end(Instant now) {
        if (status == Status.ended) {
            return;
        }
        if (status == Status.connected) {
            add(PeerMessage.Author.system, "Terminaste el chat con " + volunteer.name(), List.of());
        }
        status = Status.ended;
        answerPending = false;
        lastActivity = now;
    }

    /** The person's message; false if the chat isn't open or is full */
    synchronized boolean addFromPerson(String text, Instant now) {
        if (status != Status.connected || messages.size() >= MAX_MESSAGES) {
            return false;
        }
        add(PeerMessage.Author.person, text.strip(), List.of());
        lastActivity = now;
        return true;
    }

    /**
     * The volunteer starts answering. False if it's already doing it (then it answers again when done, with the new
     * message too) or the chat isn't open.
     */
    synchronized boolean startAnswer() {
        if (status != Status.connected) {
            return false;
        }
        if (answering) {
            answerPending = true;
            return false;
        }
        answering = true;
        return true;
    }

    /** What the volunteer gets to answer */
    synchronized VolunteerResponder.Turn turn() {
        return new VolunteerResponder.Turn(volunteer, nickname, sharedWithAuxi, List.copyOf(messages));
    }

    /** The volunteer's answer (dropped if the chat ended meanwhile); with `endsChat`, the chat closes after it */
    synchronized void addFromVolunteer(VolunteerResponder.Reply reply, Instant now) {
        if (status != Status.connected) {
            return;
        }
        List<ChatResponse.Phone> phones = reply.phones().stream()
                .map(line -> new ChatResponse.Phone(line.number(), line.name()))
                .toList();
        for (int index = 0; index < reply.messages().size() && messages.size() < MAX_MESSAGES; index++) {
            add(PeerMessage.Author.volunteer, reply.messages().get(index), index == 0 ? phones : List.of());
        }
        lastActivity = now;
        if (reply.endsChat()) {
            add(PeerMessage.Author.system, volunteer.name() + " cerró el chat", List.of());
            status = Status.ended;
            answerPending = false;
        }
    }

    /** The answer is done: true if the volunteer has to answer again (the person wrote meanwhile) */
    synchronized boolean finishAnswer() {
        boolean again = answerPending && status == Status.connected;
        answerPending = false;
        answering = again;
        return again;
    }

    /** As the person's client sees it, with the messages after `afterId` */
    synchronized PeerChatView view(long afterId) {
        List<PeerMessage> newer = messages.stream().filter(message -> message.id() > afterId).toList();
        return new PeerChatView(id, status, volunteer, availableVolunteers, expectedWait.toSeconds(), newer,
                answering && status == Status.connected);
    }

    private void add(PeerMessage.Author author, String text, List<ChatResponse.Phone> phones) {
        messages.add(new PeerMessage(++lastId, author, text, phones));
    }
}
