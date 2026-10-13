package com.auxiliar.server.chat;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ProfileAnswerServiceTest {

    private static ProfileAnswerResponse check(ProfileField field, String value, String locality, String province, boolean skipped) {
        return ProfileAnswerService.checked(field, new ProfileAnswer("Listo", skipped, value, locality, province));
    }

    @Test
    void keepsAValidAge() {
        assertThat(check(ProfileField.age, "34", null, null, false).value()).isEqualTo("34");
    }

    @Test
    void dropsAnAgeOutOfRangeOrNotANumber() {
        assertThat(check(ProfileField.age, "300", null, null, false).value()).isNull();
        assertThat(check(ProfileField.age, "34 años", null, null, false).value()).isNull();
    }

    @Test
    void aLocationNeedsItsLocality() {
        assertThat(check(ProfileField.location, null, "Palermo", "CABA", false))
                .extracting(ProfileAnswerResponse::locality, ProfileAnswerResponse::province).containsExactly("Palermo", "CABA");
        assertThat(check(ProfileField.location, null, " null ", "CABA", false).province()).isNull();
    }

    @Test
    void skippingSavesNothing() {
        ProfileAnswerResponse response = check(ProfileField.bloodType, "0+", null, null, true);
        assertThat(response.skipped()).isTrue();
        assertThat(response.value()).isNull();
    }

    @Test
    void aBlankReplyStillSaysSomething() {
        ProfileAnswerResponse response = ProfileAnswerService.checked(ProfileField.name, new ProfileAnswer(" ", false, "Ana", null, null));
        assertThat(response.reply()).isEqualTo(ProfileAnswerService.NOT_UNDERSTOOD);
        assertThat(response.value()).isEqualTo("Ana");
    }
}
