package com.auxiliar.server.peer;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Chat between a person who needs help and a volunteer. The id of a chat is only known to whoever started it.
 * Every answer has the messages after `after` (the id of the last one the client has).
 */
@RestController
@RequestMapping("/api/peer-chats")
public class PeerChatController {

    private final PeerChatService service;

    public PeerChatController(PeerChatService service) {
        this.service = service;
    }

    @PostMapping
    public PeerChatView start(@Valid @RequestBody StartPeerChatRequest request) {
        return service.start(request.nickname(), request.sharedWithAuxi(), request.preference());
    }

    @GetMapping("/{id}")
    public PeerChatView view(@PathVariable String id, @RequestParam(defaultValue = "0") long after) {
        return service.view(id, after);
    }

    @PostMapping("/{id}/messages")
    public PeerChatView send(@PathVariable String id, @RequestParam(defaultValue = "0") long after,
                             @Valid @RequestBody PeerMessageRequest request) {
        return service.send(id, request.text(), after);
    }

    @PostMapping("/{id}/end")
    public PeerChatView end(@PathVariable String id, @RequestParam(defaultValue = "0") long after) {
        return service.end(id, after);
    }

    @PostMapping("/{id}/feedback")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void feedback(@PathVariable String id, @Valid @RequestBody PeerFeedbackRequest request) {
        service.feedback(id, request);
    }
}
