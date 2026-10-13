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
public class ProfileAnswerController {

    private static final Logger log = LoggerFactory.getLogger(ProfileAnswerController.class);

    private final ProfileAnswerService profileAnswerService;

    public ProfileAnswerController(ProfileAnswerService profileAnswerService) {
        this.profileAnswerService = profileAnswerService;
    }

    @PostMapping("/api/profile/answer")
    public ProfileAnswerResponse answer(@Valid @RequestBody ProfileAnswerRequest request) {
        return profileAnswerService.interpret(request.field(), request.messages());
    }

    /** A malformed request is the client's mistake (400), not the model's: it doesn't fall into the 503 below */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public void handleBadRequest(HttpMessageNotReadableException exception) {
        log.warn("Malformed profile answer request: {}", exception.getMostSpecificCause().getMessage());
    }

    /** The model provider failed: the client shows its own fallback */
    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    public void handleModelError(RuntimeException exception) {
        log.error("Auxi could not read the profile answer", exception);
    }
}
