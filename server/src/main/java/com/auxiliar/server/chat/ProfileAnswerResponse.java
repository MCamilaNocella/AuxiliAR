package com.auxiliar.server.chat;

/**
 * Auxi's take on one answer while completing the profile. Nothing to save (value, locality and province null,
 * and not skipped) means Auxi asked again.
 *
 * @param reply Auxi's message: a short acknowledgement, or the question asked again
 * @param value the piece of data to save (the age as digits), for every field but the location
 * @param locality the locality, when the location was asked
 * @param province the province, when the location was asked
 * @param skipped the person doesn't know it or prefers not to say: move on without saving
 */
public record ProfileAnswerResponse(String reply, String value, String locality, String province, boolean skipped) {
}
