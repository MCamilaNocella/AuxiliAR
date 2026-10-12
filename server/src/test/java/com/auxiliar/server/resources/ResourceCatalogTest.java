package com.auxiliar.server.resources;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
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
 * The fixture (data/resources-fixture.json) is made of invented resources, only for tests, in the format that
 * client/scripts/resources-sync.mjs generates.
 */
class ResourceCatalogTest {

    private static final ZoneId ARGENTINA = ZoneId.of("America/Argentina/Buenos_Aires");
    private static final JsonMapper MAPPER = JsonMapper.builder().build();

    private static final String UNVERIFIED = "{\"status\":\"unverified\"}";
    private static final String VERIFIED = "{\"status\":\"verified\",\"verifiedAt\":\"2026-01-10\",\"verifiedBy\":\"test\",\"nextReviewDue\":\"2030-01-01\"}";

    private static ResourceDataset fixture;

    @BeforeAll
    static void loadFixture() throws IOException {
        try (InputStream input = new ClassPathResource("data/resources-fixture.json").getInputStream()) {
            fixture = MAPPER.readValue(input, ResourceDataset.class);
        }
    }

    private static Clock on(String day) {
        return Clock.fixed(Instant.parse(day + "T15:00:00Z"), ARGENTINA);
    }

    /** A catalog of the fixture on that day (YYYY-MM-DD) */
    private static ResourceCatalog catalogOn(String day) {
        return new ResourceCatalog(fixture, on(day));
    }

    private static ResourceDataset read(String json) {
        return MAPPER.readValue(json, ResourceDataset.class);
    }

    private static String datasetOf(String... resources) {
        return "{\"schemaVersion\":2,\"resources\":[" + String.join(",", resources) + "]}";
    }

    private static void assertRejected(String json, String message) {
        ResourceDataset dataset = read(json);
        assertThatThrownBy(() -> new ResourceCatalog(dataset, Clock.systemUTC()))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining(message);
    }

    /** A line (kind orientation) with one number */
    private static String line(String id, String dial, String verification) {
        return """
                {"id":"%s","name":"Prueba","kind":"orientation",
                 "contacts":[{"type":"phone","dial":"%s","display":"x"}],
                 "verification":%s}""".formatted(id, dial, verification);
    }

    /** A line with the official source that a verified resource needs */
    private static String withSource(String resource, String source) {
        return resource.substring(0, resource.lastIndexOf("}")) + source + "}";
    }

    /** A place (kind service) verified until 2030, with what goes after its verification (e.g. ,"services":[…]) */
    private static String place(String id, String extra) {
        return """
                {"id":"%s","name":"Lugar","kind":"service","facilityType":"hospital",
                 "source":{"organization":"x","url":"https://example.org"},
                 "verification":%s%s}""".formatted(id, VERIFIED, extra);
    }

    /** A resolved service of a place, as the generated file has them */
    private static String service(String id, String verification, String extra) {
        return """
                {"id":"%s","type":"vaccination","categories":["salud-fisica"],"verification":%s%s}""".formatted(id, verification, extra);
    }

    @Test
    void theRealDatasetLoadsAndIsValid() throws IOException {
        ResourceCatalog catalog = new ResourceCatalog(MAPPER, new ClassPathResource("data/resources.json"));

        assertThat(catalog.all()).allSatisfy(resource -> assertThat(resource.id()).isNotBlank());
    }

    @Test
    void readsALineFromTheFixture() {
        ResourceCatalog catalog = catalogOn("2026-03-01");

        assertThat(catalog.all()).hasSize(7);
        HealthResource weekdays = catalog.findById("fixture-linea-vencida").orElseThrow();
        assertThat(weekdays.kind()).isEqualTo(HealthResource.Kind.URGENT_SUPPORT);
        assertThat(weekdays.hours().open24h()).isFalse();
        assertThat(weekdays.hours().schedule()).hasSize(1);
        assertThat(weekdays.hours().schedule().get(0).days()).containsExactly(1, 2, 3, 4, 5);
        assertThat(weekdays.coverage().areas()).containsExactly("amba");
        // Unknown hours are null, never "24 h"
        assertThat(catalog.findById("fixture-linea-sin-verificar").orElseThrow().hours()).isNull();
        assertThat(catalog.findById("fixture-emergencia").orElseThrow().display().emergencyBarOrder()).isEqualTo(1);
    }

    @Test
    void readsAPlaceWithoutServices() {
        HealthResource center = catalogOn("2026-03-01").findById("fixture-centro").orElseThrow();

        assertThat(center.kind()).isEqualTo(HealthResource.Kind.SERVICE);
        assertThat(center.services()).isEmpty();
        assertThat(center.categories()).containsExactly("centros", "salud-fisica");
        assertThat(ResourceCatalog.categoriesOf(center)).containsExactly("centros", "salud-fisica");
        assertThat(center.sections()).containsExactly(new HealthResource.SectionRef("centros", "section-1"));
        assertThat(center.contacts()).extracting(HealthResource.Contact::type)
                .containsExactly(HealthResource.ContactType.PHONE, HealthResource.ContactType.WHATSAPP);
        assertThat(center.coverage().level()).isEqualTo(HealthResource.CoverageLevel.MUNICIPAL);
        assertThat(center.cost()).isEqualTo(HealthResource.Cost.FREE);
        assertThat(center.audience()).containsExactly("adults", "older-adults");
        assertThat(center.coordinates().precision()).isEqualTo(HealthResource.Precision.APPROXIMATE);
        assertThat(center.coordinates().status()).isEqualTo(HealthResource.CoordinateStatus.VERIFIED);
        assertThat(center.coordinates().method()).isEqualTo("manual-map");
    }

    @Test
    void readsAnEstablishmentWithItsServicesResolved() {
        HealthResource cesac = catalogOn("2026-03-01").findById("fixture-cesac").orElseThrow();

        assertThat(cesac.facilityType()).isEqualTo("health-center");
        assertThat(cesac.jurisdiction().level()).isEqualTo("municipal");
        assertThat(cesac.jurisdiction().organization()).isEqualTo("FIXTURE Gobierno de prueba");
        assertThat(cesac.externalIds()).containsEntry("refes", "FIXTURE-0001");
        assertThat(cesac.address().neighborhood()).isEqualTo("Barrio de prueba");
        assertThat(cesac.address().reference()).isEqualTo("Entrada por el patio");
        assertThat(cesac.address().georef().localityId()).isEqualTo("00000000");
        assertThat(cesac.coordinates().status()).isEqualTo(HealthResource.CoordinateStatus.VERIFIED);
        assertThat(cesac.coordinates().method()).isEqualTo("official-dataset");
        assertThat(cesac.categories()).isEmpty();
        assertThat(cesac.derivedCategories()).containsExactly("esi", "salud-fisica", "salud-mental");
        assertThat(ResourceCatalog.categoriesOf(cesac)).containsExactly("esi", "salud-fisica", "salud-mental");
        assertThat(cesac.services()).extracting(HealthResource.Service::id)
                .containsExactly("vacunacion", "odontologia", "salud-mental", "anticonceptivos");

        // Says nothing: everything comes from the establishment
        HealthResource.Service vaccination = cesac.services().get(0);
        assertThat(vaccination.type()).isEqualTo("vaccination");
        assertThat(vaccination.hours().schedule().get(0).days()).containsExactly(1, 2, 3, 4, 5);
        assertThat(vaccination.cost()).isEqualTo(HealthResource.Cost.FREE);
        assertThat(vaccination.requirements()).containsExactly("Documento de prueba");
        assertThat(vaccination.audience()).containsExactly("all");
        assertThat(vaccination.appointment().mode()).isEqualTo(HealthResource.AppointmentMode.UNKNOWN);
        assertThat(vaccination.categories()).containsExactly("salud-fisica");
        assertThat(vaccination.verification().status()).isEqualTo(HealthResource.Status.VERIFIED);
        assertThat(vaccination.source().url()).isEqualTo("https://example.org/fixture-cesac");

        // Its own values win
        HealthResource.Service dentistry = cesac.services().get(1);
        assertThat(dentistry.hours().schedule().get(0).from()).isEqualTo("09:00");
        assertThat(dentistry.cost()).isEqualTo(HealthResource.Cost.MIXED);
        assertThat(dentistry.requirements()).containsExactly("Documento de prueba", "Carnet de prueba");
        assertThat(dentistry.appointment().mode()).isEqualTo(HealthResource.AppointmentMode.REQUIRED);
        assertThat(dentistry.appointment().url()).isEqualTo("https://example.org/turnos");
        assertThat(dentistry.contacts()).extracting(HealthResource.Contact::dial).containsExactly("5550301");

        assertThat(cesac.services().get(2).verification().status()).isEqualTo(HealthResource.Status.UNVERIFIED);
        HealthResource.Service contraception = cesac.services().get(3);
        assertThat(contraception.audience()).containsExactly("adolescents", "adults");
        assertThat(contraception.verification().nextReviewDue()).isEqualTo("2026-06-01");
        assertThat(contraception.source().url()).isEqualTo("https://example.org/fixture-cesac-anticonceptivos");
        // hours: null in the source is "not known": it does not inherit the establishment's
        assertThat(contraception.hours()).isNull();
    }

    @Test
    void aCostNobodySaidIsUnknownNeverFree() {
        HealthResource hospital = catalogOn("2026-03-01").findById("fixture-hospital").orElseThrow();

        assertThat(hospital.cost()).isNull();
        assertThat(hospital.services()).extracting(HealthResource.Service::cost).containsOnly(HealthResource.Cost.UNKNOWN);
        assertThat(hospital.services().get(0).hours().open24h()).isTrue();
        assertThat(hospital.services().get(1).hours()).isNull();
        assertThat(hospital.coordinates().status()).isEqualTo(HealthResource.CoordinateStatus.UNVERIFIED);
        assertThat(hospital.coordinates().method()).isEqualTo("geocoded-usig");
    }

    @Test
    void aPlaceCanHaveNoContactsAndNoCoordinates() {
        HealthResource vet = catalogOn("2026-03-01").findById("fixture-veterinaria").orElseThrow();

        assertThat(vet.contacts()).isEmpty();
        assertThat(vet.coordinates()).isNull();
        assertThat(vet.address().street()).isEqualTo("Calle Veterinaria");
        assertThat(vet.services()).extracting(HealthResource.Service::type).containsExactly("rabies-vaccination", "spaying-neutering");
        assertThat(vet.services().get(1).appointment().mode()).isEqualTo(HealthResource.AppointmentMode.RECOMMENDED);
        assertThat(ResourceCatalog.categoriesOf(vet)).containsExactly("animales");
    }

    @Test
    void onlyVerifiedResourcesThatHaveNotExpiredAreCurrent() {
        ResourceCatalog catalog = catalogOn("2026-03-01");

        assertThat(catalog.current()).extracting(HealthResource::id)
                .containsExactlyInAnyOrder("fixture-emergencia", "fixture-centro", "fixture-cesac", "fixture-hospital", "fixture-veterinaria");
        assertThat(catalog.currentPlaces()).extracting(HealthResource::id)
                .containsExactlyInAnyOrder("fixture-cesac", "fixture-hospital", "fixture-veterinaria");
    }

    @Test
    void aResourceStopsBeingCurrentOnItsReviewDay() {
        ResourceCatalog catalog = catalogOn("2026-03-01");
        HealthResource emergency = catalog.findById("fixture-emergencia").orElseThrow();

        assertThat(catalog.isCurrent(emergency, LocalDate.parse("2026-07-09"))).isTrue();
        assertThat(catalog.isCurrent(emergency, LocalDate.parse("2026-07-10"))).isFalse();
        assertThat(catalogOn("2026-07-09").current()).extracting(HealthResource::id).contains("fixture-emergencia");
        assertThat(catalogOn("2026-07-10").current()).extracting(HealthResource::id).doesNotContain("fixture-emergencia");
    }

    @Test
    void servicesAreCurrentWhileTheirPlaceAndTheirOwnVerificationAre() {
        HealthResource cesac = catalogOn("2026-03-01").findById("fixture-cesac").orElseThrow();

        // The unverified service is out; the one with its own review date is in until it arrives
        assertThat(catalogOn("2026-03-01").currentServices(cesac)).extracting(HealthResource.Service::id)
                .containsExactly("vacunacion", "odontologia", "anticonceptivos");
        assertThat(catalogOn("2026-05-31").currentServices(cesac)).extracting(HealthResource.Service::id)
                .containsExactly("vacunacion", "odontologia", "anticonceptivos");
        assertThat(catalogOn("2026-06-01").currentServices(cesac)).extracting(HealthResource.Service::id)
                .containsExactly("vacunacion", "odontologia");
        // When the establishment's own verification expires, none of its services is shown
        assertThat(catalogOn("2030-01-01").currentServices(cesac)).isEmpty();
        assertThat(catalogOn("2030-01-01").currentPlaces()).isEmpty();
    }

    @Test
    void aPlaceWithoutCurrentServicesIsNotShown() {
        String place = place("a", ",\"services\":[" + service("s1", UNVERIFIED, "") + "]");
        ResourceCatalog catalog = new ResourceCatalog(read(datasetOf(place)), on("2026-03-01"));
        HealthResource resource = catalog.findById("a").orElseThrow();

        assertThat(catalog.isCurrent(resource)).isTrue();
        assertThat(catalog.currentServices(resource)).isEmpty();
        assertThat(catalog.current()).isEmpty();
        assertThat(catalog.currentPlaces()).isEmpty();
    }

    @Test
    void categoriesComeFromTheCurrentServices() {
        ResourceCatalog catalog = catalogOn("2026-03-01");

        assertThat(catalog.currentByCategory("esi")).extracting(HealthResource::id).containsExactly("fixture-cesac");
        assertThat(catalog.currentByCategory("animales")).extracting(HealthResource::id).containsExactly("fixture-veterinaria");
        // The CeSAC's mental health service is unverified, so only the hospital shows up under Salud mental
        assertThat(catalog.currentByCategory("salud-mental")).extracting(HealthResource::id).containsExactly("fixture-hospital");
        // A resource without services uses its own categories
        assertThat(catalog.currentByCategory("salud-fisica")).extracting(HealthResource::id)
                .containsExactlyInAnyOrder("fixture-centro", "fixture-cesac", "fixture-hospital");
        assertThat(catalog.currentByCategory("primeros-auxilios")).extracting(HealthResource::id).containsExactly("fixture-emergencia");
        // When the only service of a category expires, the place leaves that category (and stays in the others)
        assertThat(catalogOn("2026-06-01").currentByCategory("esi")).isEmpty();
        assertThat(catalogOn("2026-06-01").currentByCategory("salud-fisica")).extracting(HealthResource::id).contains("fixture-cesac");
    }

    @Test
    void onlyPlacesWithVerifiedCoordinatesGoOnTheMap() {
        ResourceCatalog catalog = catalogOn("2026-03-01");

        assertThat(catalog.currentMappablePlaces()).extracting(HealthResource::id).containsExactly("fixture-cesac");
        // The hospital has a candidate point (unverified) and the veterinary has none: both are only in the list
        assertThat(ResourceCatalog.isMappable(catalog.findById("fixture-hospital").orElseThrow())).isFalse();
        assertThat(ResourceCatalog.isMappable(catalog.findById("fixture-veterinaria").orElseThrow())).isFalse();
        assertThat(catalog.currentPlaces()).extracting(HealthResource::id).contains("fixture-hospital", "fixture-veterinaria");
    }

    @Test
    void findsByNumberComparingDigitsOnly() {
        ResourceCatalog catalog = catalogOn("2026-03-01");

        assertThat(catalog.findByDial("+54 0000-000001")).map(HealthResource::id).contains("fixture-centro");
        assertThat(catalog.findByDial("555 0100")).map(HealthResource::id).contains("fixture-linea-sin-verificar");
        // A service's own number
        assertThat(catalog.findByDial("555-0301")).map(HealthResource::id).contains("fixture-cesac");
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
    void placesShareACentralNumberAndAnExpiredOneDoesNotHideACurrentOne() {
        ResourceCatalog catalog = catalogOn("2026-03-01");

        assertThat(catalog.findAllCurrentByDial("555-0300")).extracting(HealthResource::id)
                .containsExactlyInAnyOrder("fixture-cesac", "fixture-hospital");

        String expired = "{\"status\":\"verified\",\"verifiedAt\":\"2024-01-01\",\"verifiedBy\":\"test\",\"nextReviewDue\":\"2025-01-01\"}";
        String shared = ",\"contacts\":[{\"type\":\"phone\",\"dial\":\"5550777\",\"display\":\"x\"}]";
        String first = place("first", shared).replace(VERIFIED, expired);
        ResourceCatalog both = new ResourceCatalog(read(datasetOf(first, place("second", shared))), on("2026-03-01"));
        assertThat(both.findByDial("5550777")).map(HealthResource::id).contains("first");
        assertThat(both.findCurrentByDial("5550777")).map(HealthResource::id).contains("second");
    }

    @Test
    void aServicesOwnNumberOnlyCountsWhileThatServiceIsCurrent() {
        String own = ",\"contacts\":[{\"type\":\"phone\",\"dial\":\"5550888\",\"display\":\"x\"}]";
        String currentService = service("s1", VERIFIED, own);
        String unverifiedService = service("s1", UNVERIFIED, own);
        // The place has another current service, so it is shown, but the unverified one's number isn't
        String other = service("s2", VERIFIED, "");

        ResourceCatalog withCurrent = new ResourceCatalog(read(datasetOf(place("a", ",\"services\":[" + currentService + "]"))), on("2026-03-01"));
        assertThat(withCurrent.findCurrentByDial("5550888")).map(HealthResource::id).contains("a");

        ResourceCatalog withUnverified = new ResourceCatalog(read(datasetOf(place("a", ",\"services\":[" + unverifiedService + "," + other + "]"))), on("2026-03-01"));
        assertThat(withUnverified.current()).extracting(HealthResource::id).containsExactly("a");
        assertThat(withUnverified.findByDial("5550888")).map(HealthResource::id).contains("a");
        assertThat(withUnverified.findCurrentByDial("5550888")).isEmpty();
    }

    @Test
    void emergencyIsTheKind() {
        ResourceCatalog catalog = catalogOn("2026-03-01");

        assertThat(ResourceCatalog.isEmergency(catalog.findById("fixture-emergencia").orElseThrow())).isTrue();
        assertThat(ResourceCatalog.isEmergency(catalog.findById("fixture-centro").orElseThrow())).isFalse();
    }

    @Test
    void refusesADatasetInAFormatItDoesNotKnow() {
        assertRejected("{\"schemaVersion\":3,\"resources\":[]}", "schemaVersion 3");
        assertRejected("{\"schemaVersion\":1,\"resources\":[]}", "schemaVersion 1");
    }

    @Test
    void refusesRepeatedIdsAndLinesSharingANumber() {
        assertRejected(datasetOf(line("a", "5550001", UNVERIFIED), line("a", "5550002", UNVERIFIED)), "id repetido");
        assertRejected(datasetOf(line("a", "5550001", UNVERIFIED), line("b", "5550001", UNVERIFIED)), "solo los lugares pueden compartir");
        assertRejected(datasetOf(line("a", "+5550001", UNVERIFIED), line("b", "5550001", UNVERIFIED)), "solo los lugares pueden compartir");
        // A line can't share with a place either
        String sharing = ",\"contacts\":[{\"type\":\"phone\",\"dial\":\"5550001\",\"display\":\"x\"}]";
        assertRejected(datasetOf(line("a", "5550001", UNVERIFIED), place("b", sharing)), "solo los lugares pueden compartir");
        // Places do
        assertThatCode(() -> new ResourceCatalog(read(datasetOf(place("a", sharing), place("b", sharing))), Clock.systemUTC())).doesNotThrowAnyException();
    }

    @Test
    void refusesInvalidIdsAndNumbers() {
        assertRejected(datasetOf(line("Con Espacios", "5550001", UNVERIFIED)), "id inválido");
        assertRejected(datasetOf(line("a", "0800-333-0160", UNVERIFIED)), "formato inválido");
        assertRejected(datasetOf(line("a", "12", UNVERIFIED)), "formato inválido");
    }

    @Test
    void aVerifiedResourceNeedsItsProof() {
        String noReviewDate = "{\"status\":\"verified\",\"verifiedAt\":\"2026-01-10\",\"verifiedBy\":\"test\"}";
        assertRejected(datasetOf(line("a", "5550001", noReviewDate)), "necesita nextReviewDue");

        String noSource = "{\"status\":\"verified\",\"verifiedAt\":\"2026-01-10\",\"verifiedBy\":\"test\",\"nextReviewDue\":\"2026-07-10\"}";
        assertRejected(datasetOf(line("a", "5550001", noSource)), "necesita source.url");

        String reviewBeforeVerification = "{\"status\":\"verified\",\"verifiedAt\":\"2026-01-10\",\"verifiedBy\":\"test\",\"nextReviewDue\":\"2026-01-10\"}";
        assertRejected(datasetOf(line("a", "5550001", reviewBeforeVerification)), "posterior a verifiedAt");
    }

    @Test
    void refusesImpossibleDatesAndMissingVerification() {
        String impossible = "{\"status\":\"unverified\",\"verifiedAt\":\"2026-02-30\"}";
        assertRejected(datasetOf(line("a", "5550001", impossible)), "no es una fecha real");

        assertRejected(datasetOf("""
                {"id":"a","name":"Prueba","kind":"orientation","contacts":[{"type":"phone","dial":"5550001","display":"x"}]}"""),
                "falta verification.status");
    }

    @Test
    void aLineNeedsAContactButAPlaceDoesNot() {
        assertRejected(datasetOf("""
                {"id":"a","name":"Prueba","kind":"orientation","verification":{"status":"unverified"}}"""),
                "necesita al menos un contacto");
        assertThatCode(() -> new ResourceCatalog(read(datasetOf(place("a", ""))), Clock.systemUTC())).doesNotThrowAnyException();
    }

    @Test
    void servicesNeedAnEstablishmentWithAFacilityType() {
        String services = ",\"services\":[" + service("s1", VERIFIED, "") + "]";
        assertRejected(datasetOf(place("a", services).replace("\"facilityType\":\"hospital\",", "")), "necesita facilityType");
        assertRejected(datasetOf(place("a", services).replace("\"kind\":\"service\"", "\"kind\":\"orientation\"")), "solo van en recursos de tipo service");
    }

    @Test
    void refusesInvalidServices() {
        assertRejected(datasetOf(place("a", ",\"services\":[" + service("s1", VERIFIED, "") + "," + service("s1", VERIFIED, "") + "]")),
                "id repetido en este establecimiento");
        assertRejected(datasetOf(place("a", ",\"services\":[" + service("Con Espacios", VERIFIED, "") + "]")), "id de prestación inválido");

        // A verified service needs the proof, and a source (its own or the establishment's)
        String noVerifier = "{\"status\":\"verified\",\"verifiedAt\":\"2026-01-10\",\"nextReviewDue\":\"2030-01-01\"}";
        assertRejected(datasetOf(place("a", ",\"services\":[" + service("s1", noVerifier, "") + "]")), "a › s1: un recurso verificado necesita verifiedBy");
        String sourceless = place("a", ",\"services\":[" + service("s1", VERIFIED, "") + "]").replace("\"source\":{\"organization\":\"x\",\"url\":\"https://example.org\"},", "");
        assertRejected(datasetOf(sourceless), "necesita source.url");
        // A service with its own source is enough, even if the establishment has none (it isn't verified itself)
        String ownSource = ",\"source\":{\"organization\":\"x\",\"url\":\"https://example.org\"}";
        String unverifiedPlace = "{\"id\":\"a\",\"name\":\"Lugar\",\"kind\":\"service\",\"facilityType\":\"hospital\",\"verification\":" + UNVERIFIED + ",\"services\":[";
        assertThatCode(() -> new ResourceCatalog(read(datasetOf(unverifiedPlace + service("s1", VERIFIED, ownSource) + "]}")), Clock.systemUTC()))
                .doesNotThrowAnyException();
        assertRejected(datasetOf(unverifiedPlace + service("s1", VERIFIED, "") + "]}"), "a › s1: un recurso verificado necesita source.url");
    }

    @Test
    void coordinatesNeedToSayWhereTheyCameFromAndBeInArgentina() {
        String verified = "\"verifiedAt\":\"2026-01-10\",\"verifiedBy\":\"test\"";
        String point = "{\"lat\":-34.6,\"lng\":-58.4,\"precision\":\"exact\",\"status\":\"verified\",%s}";

        assertRejected(datasetOf(place("a", ",\"coordinates\":" + point.formatted(verified))), "necesitan method");
        assertRejected(datasetOf(place("a", ",\"coordinates\":" + point.formatted("\"method\":\"manual-map\",\"verifiedBy\":\"test\""))), "necesitan verifiedAt");
        assertRejected(datasetOf(place("a", ",\"coordinates\":" + point.formatted("\"method\":\"manual-map\",\"verifiedAt\":\"2026-01-10\""))), "necesitan verifiedBy");
        // Latitude and longitude swapped
        String swapped = "{\"lat\":-58.4,\"lng\":-34.6,\"precision\":\"exact\",\"status\":\"unverified\"}";
        assertRejected(datasetOf(place("a", ",\"coordinates\":" + swapped)), "fuera de Argentina");
        // A candidate point needs none of that proof
        String candidate = "{\"lat\":-34.6,\"lng\":-58.4,\"precision\":\"approximate\",\"status\":\"unverified\"}";
        assertThatCode(() -> new ResourceCatalog(read(datasetOf(place("a", ",\"coordinates\":" + candidate))), Clock.systemUTC())).doesNotThrowAnyException();
    }

    @Test
    void theSameEstablishmentCannotBeLoadedTwice() {
        String refes = ",\"externalIds\":{\"refes\":\"X-1\"}";
        assertRejected(datasetOf(place("a", refes), place("b", refes)), "externalIds refes \"X-1\" ya está en");
        assertRejected(datasetOf(place("a", ",\"externalIds\":{\"REFES\":\"X-1\"}")), "minúsculas y guiones");
        // The same value under another register is not the same establishment
        assertThatCode(() -> new ResourceCatalog(
                read(datasetOf(place("a", refes), place("b", ",\"externalIds\":{\"gcba\":\"X-1\"}"))), Clock.systemUTC())).doesNotThrowAnyException();
    }

    @Test
    void aLineWhoseReviewDateArrivedIsStillThereButIsReportedAsUnchecked() {
        String dueOnJanuary = "{\"status\":\"verified\",\"verifiedAt\":\"2026-10-08\",\"verifiedBy\":\"test\",\"nextReviewDue\":\"2027-01-06\"}";
        String source = ",\"source\":{\"organization\":\"x\",\"url\":\"https://example.org\"}";
        ResourceDataset dataset = read(datasetOf(withSource(line("vence", "911", dueOnJanuary), source), line("no-verificada", "144", UNVERIFIED), withSource(line("vigente", "107", VERIFIED), source)));
        // before the date: nothing to report
        assertThat(new ResourceCatalog(dataset, on("2027-01-05")).uncheckedLines()).isEmpty();
        // from the date on: it is reported (it is not shown as current), the unverified one is not a line anyone saw, the current one is fine
        ResourceCatalog later = new ResourceCatalog(dataset, on("2027-01-06"));
        assertThat(later.uncheckedLines()).extracting(HealthResource::id).containsExactly("vence");
        assertThat(later.findCurrentByDial("911")).isEmpty();
        assertThat(later.findByDial("911")).isPresent();
    }
}
