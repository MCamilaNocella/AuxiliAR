package com.auxiliar.server.chat;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChatController {

    private static final Logger log = LoggerFactory.getLogger(ChatController.class);

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/api/chat")
    public ChatResponse chat(@Valid @RequestBody ChatRequest request) {
        return chatService.reply(request.messages(), request.isEmergency(), request.profile());
    }

    /** A malformed request is the client's mistake (400), not the model's: it doesn't fall into the 503 below */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public void handleBadRequest(HttpMessageNotReadableException exception) {
        log.warn("Malformed chat request: {}", exception.getMostSpecificCause().getMessage());
    }

    /** The model provider failed (no API key, rate limit, timeout...): the client shows its own fallback */
    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    public void handleModelError(RuntimeException exception) {
        log.error("Auxi could not answer", exception);
    }
}
