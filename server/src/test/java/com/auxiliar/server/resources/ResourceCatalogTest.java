package com.auxiliar.server.resources;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.io.IOException;
import java.io.InputStream;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

import tools.jackson.databind.json.JsonMapper;

/**
 * The fixture (data/resources-fixture.json) is made of invented resources, only for tests. It is the same file
 * client/scripts/resources-sync.test.mjs keeps equal to what the sync generates from the client's fixtures,
 * so the client's format and what this class reads are tested against each other.
 */
class ResourceCatalogTest {

    private static final ZoneId ARGENTINA = ZoneId.of("America/Argentina/Buenos_Aires");
    private static final JsonMapper MAPPER = JsonMapper.builder().build();

    private static ResourceDataset fixture;

    @BeforeAll
    static void loadFixture() throws IOException {
        try (InputStream input = new ClassPathResource("data/resources-fixture.json").getInputStream()) {
            fixture = MAPPER.readValue(input, ResourceDataset.class);
        }
    }

    /** A catalog of the fixture on that day (YYYY-MM-DD) */
    private static ResourceCatalog catalogOn(String day) {
        return new ResourceCatalog(fixture, Clock.fixed(Instant.parse(day + "T15:00:00Z"), ARGENTINA));
    }

    private static String resource(String id, String dial, String verification) {
        return """
                {"id":"%s","name":"Prueba","kind":"orientation",
                 "contacts":[{"type":"phone","dial":"%s","display":"x"}],
                 "verification":%s}""".formatted(id, dial, verification);
    }

    private static final String UNVERIFIED = "{\"status\":\"unverified\"}";

    private static void assertRejected(String json, String message) {
        ResourceDataset dataset = MAPPER.readValue(json, ResourceDataset.class);
        assertThatThrownBy(() -> new ResourceCatalog(dataset, Clock.systemUTC()))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining(message);
    }

    private static String datasetOf(String... resources) {
        return "{\"schemaVersion\":1,\"resources\":[" + String.join(",", resources) + "]}";
    }

    @Test
    void theRealDatasetLoadsAndIsValid() throws IOException {
        ResourceCatalog catalog = new ResourceCatalog(MAPPER, new ClassPathResource("data/resources.json"));

        assertThat(catalog.all()).allSatisfy(resource -> {
            assertThat(resource.id()).isNotBlank();
            assertThat(resource.contacts()).isNotEmpty();
        });
    }

    @Test
    void readsEveryFieldOfTheFixture() {
        ResourceCatalog catalog = catalogOn("2026-03-01");

        assertThat(catalog.all()).hasSize(4);
        HealthResource center = catalog.findById("fixture-centro").orElseThrow();
        assertThat(center.kind()).isEqualTo(HealthResource.Kind.SERVICE);
        assertThat(center.categories()).containsExactly("centros", "salud-fisica");
        assertThat(center.sections()).containsExactly(new HealthResource.SectionRef("centros", "section-1"));
        assertThat(center.contacts()).extracting(HealthResource.Contact::type)
                .containsExactly(HealthResource.ContactType.PHONE, HealthResource.ContactType.WHATSAPP);
        assertThat(center.coverage().level()).isEqualTo(HealthResource.CoverageLevel.MUNICIPAL);
        assertThat(center.coverage().provinces()).containsExactly("AR-C");
        assertThat(center.cost()).isEqualTo(HealthResource.Cost.FREE);
        assertThat(center.audience()).containsExactly("adults", "older-adults");
        assertThat(center.coordinates().precision()).isEqualTo(HealthResource.Precision.APPROXIMATE);
        assertThat(center.verification().status()).isEqualTo(HealthResource.Status.VERIFIED);

        HealthResource weekdays = catalog.findById("fixture-linea-vencida").orElseThrow();
        assertThat(weekdays.hours().open24h()).isFalse();
        assertThat(weekdays.hours().schedule()).hasSize(1);
        assertThat(weekdays.hours().schedule().get(0).days()).containsExactly(1, 2, 3, 4, 5);
        assertThat(weekdays.coverage().areas()).containsExactly("amba");

        // Unknown hours are null, never "24 h"
        assertThat(catalog.findById("fixture-linea-sin-verificar").orElseThrow().hours()).isNull();
        assertThat(catalog.findById("fixture-emergencia").orElseThrow().display().emergencyBarOrder()).isEqualTo(1);
    }

    @Test
    void onlyVerifiedResourcesThatHaveNotExpiredAreCurrent() {
        ResourceCatalog catalog = catalogOn("2026-03-01");

        assertThat(catalog.current()).extracting(HealthResource::id)
                .containsExactlyInAnyOrder("fixture-emergencia", "fixture-centro");
    }

    @Test
    void aResourceStopsBeingCurrentOnItsReviewDay() {
        HealthResource emergency = catalogOn("2026-03-01").findById("fixture-emergencia").orElseThrow();
        ResourceCatalog catalog = catalogOn("2026-03-01");

        assertThat(catalog.isCurrent(emergency, LocalDate.parse("2026-07-09"))).isTrue();
        assertThat(catalog.isCurrent(emergency, LocalDate.parse("2026-07-10"))).isFalse();
        assertThat(catalogOn("2026-07-09").current()).extracting(HealthResource::id).contains("fixture-emergencia");
        assertThat(catalogOn("2026-07-10").current()).extracting(HealthResource::id).doesNotContain("fixture-emergencia");
    }

    @Test
    void findsByNumberComparingDigitsOnly() {
        ResourceCatalog catalog = catalogOn("2026-03-01");

        assertThat(catalog.findByDial("+54 0000-000001")).map(HealthResource::id).contains("fixture-centro");
        assertThat(catalog.findByDial("555 0100")).map(HealthResource::id).contains("fixture-linea-sin-verificar");
        assertThat(catalog.findByDial("999")).isEmpty();
        assertThat(catalog.findByDial("abc")).isEmpty();
        assertThat(catalog.findByDial(null)).isEmpty();
    }

    @Test
    void theNumbersAuxiMayShowAreOnlyTheCurrentOnes() {
        ResourceCatalog catalog = catalogOn("2026-03-01");

        assertThat(catalog.findCurrentByDial("000")).map(HealthResource::id).contains("fixture-emergencia");
        assertThat(catalog.findCurrentByDial("+540000000002")).map(HealthResource::id).contains("fixture-centro");
        // Unverified, and verified but past its review date
        assertThat(catalog.findCurrentByDial("5550100")).isEmpty();
        assertThat(catalog.findCurrentByDial("555-0200")).isEmpty();
    }

    @Test
    void emergencyIsTheKind() {
        ResourceCatalog catalog = catalogOn("2026-03-01");

        assertThat(ResourceCatalog.isEmergency(catalog.findById("fixture-emergencia").orElseThrow())).isTrue();
        assertThat(ResourceCatalog.isEmergency(catalog.findById("fixture-centro").orElseThrow())).isFalse();
    }

    @Test
    void refusesADatasetInAFormatItDoesNotKnow() {
        assertRejected("{\"schemaVersion\":2,\"resources\":[]}", "schemaVersion 2");
    }

    @Test
    void refusesRepeatedIdsAndNumbers() {
        assertRejected(datasetOf(resource("a", "5550001", UNVERIFIED), resource("a", "5550002", UNVERIFIED)), "id repetido");
        assertRejected(datasetOf(resource("a", "5550001", UNVERIFIED), resource("b", "5550001", UNVERIFIED)), "ya está en a");
        assertRejected(datasetOf(resource("a", "+5550001", UNVERIFIED), resource("b", "5550001", UNVERIFIED)), "ya está en a");
    }

    @Test
    void refusesInvalidIdsAndNumbers() {
        assertRejected(datasetOf(resource("Con Espacios", "5550001", UNVERIFIED)), "id inválido");
        assertRejected(datasetOf(resource("a", "0800-333-0160", UNVERIFIED)), "formato inválido");
        assertRejected(datasetOf(resource("a", "12", UNVERIFIED)), "formato inválido");
    }

    @Test
    void aVerifiedResourceNeedsItsProof() {
        String noReviewDate = "{\"status\":\"verified\",\"verifiedAt\":\"2026-01-10\",\"verifiedBy\":\"test\"}";
        assertRejected(datasetOf(resource("a", "5550001", noReviewDate)), "necesita nextReviewDue");

        String noSource = "{\"status\":\"verified\",\"verifiedAt\":\"2026-01-10\",\"verifiedBy\":\"test\",\"nextReviewDue\":\"2026-07-10\"}";
        assertRejected(datasetOf(resource("a", "5550001", noSource)), "necesita source.url");

        String reviewBeforeVerification = "{\"status\":\"verified\",\"verifiedAt\":\"2026-01-10\",\"verifiedBy\":\"test\",\"nextReviewDue\":\"2026-01-10\"}";
        assertRejected(datasetOf(resource("a", "5550001", reviewBeforeVerification)), "posterior a verifiedAt");
    }

    @Test
    void refusesImpossibleDatesAndMissingVerification() {
        String impossible = "{\"status\":\"unverified\",\"verifiedAt\":\"2026-02-30\"}";
        assertRejected(datasetOf(resource("a", "5550001", impossible)), "no es una fecha real");

        assertRejected(datasetOf("""
                {"id":"a","name":"Prueba","kind":"orientation","contacts":[{"type":"phone","dial":"5550001","display":"x"}]}"""),
                "falta verification.status");
    }
}
