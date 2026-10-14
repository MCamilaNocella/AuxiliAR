package com.auxiliar.server.peer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** A message from the person to the volunteer */
public record PeerMessageRequest(@NotBlank @Size(max = 2000) String text) {
}
