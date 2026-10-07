package com.auxiliar.server.resources;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * A verified help resource (help line, or a place with its services), as the client's dataset defines it
 * (client/src/data/resources, schema in resource.schema.json). Read from the generated data/resources.json.
 * Only id, name, kind and verification are always there: the rest may be missing (null, an empty list or map).
 * Whether it is an emergency is the kind (see {@link ResourceCatalog#isEmergency}).
 *
 * <p>A place (kind SERVICE) is a single record with everything it offers in {@code services}. In the generated file
 * the services come resolved: what a service doesn't say is already filled in from its place (hours, cost,
 * requirements, audience, source, verification), and its categories derived from its type, so nothing here
 * inherits anything. {@code derivedCategories} is what the place shows up under; a resource without services
 * uses its own {@code categories} (see {@link ResourceCatalog#categoriesOf}).
 *
 * @param facilityType type of establishment (taxonomy.facilityTypes); a String so a new type needs no change here
 * @param externalIds ids in other registers (e.g. "refes"), to avoid loading the same place twice
 */
public record HealthResource(
        String id,
        String name,
        String shortName,
        Kind kind,
        String facilityType,
        String description,
        String whenToUse,
        List<String> categories,
        List<SectionRef> sections,
        List<Contact> contacts,
        Coverage coverage,
        Jurisdiction jurisdiction,
        Hours hours,
        Cost cost,
        String costNote,
        List<String> requirements,
        List<String> audience,
        Address address,
        Coordinates coordinates,
        List<Service> services,
        Map<String, String> externalIds,
        Source source,
        Verification verification,
        List<String> aliases,
        Display display,
        List<String> derivedCategories) {

    public HealthResource {
        categories = orEmpty(categories);
        sections = orEmpty(sections);
        contacts = orEmpty(contacts);
        requirements = orEmpty(requirements);
        audience = orEmpty(audience);
        services = orEmpty(services);
        aliases = orEmpty(aliases);
        derivedCategories = orEmpty(derivedCategories);
        externalIds = externalIds == null ? Map.of() : Map.copyOf(externalIds);
    }

    private static <T> List<T> orEmpty(List<T> list) {
        return list == null ? List.of() : List.copyOf(list);
    }

    /** emergency: immediate risk to life; urgent-support: urgent human help, no dispatch; orientation: advice; service: a place or program */
    public enum Kind {
        @JsonProperty("emergency") EMERGENCY,
        @JsonProperty("urgent-support") URGENT_SUPPORT,
        @JsonProperty("orientation") ORIENTATION,
        @JsonProperty("service") SERVICE
    }

    public enum ContactType {
        @JsonProperty("phone") PHONE,
        @JsonProperty("whatsapp") WHATSAPP
    }

    public enum CoverageLevel {
        @JsonProperty("national") NATIONAL,
        @JsonProperty("region") REGION,
        @JsonProperty("province") PROVINCE,
        @JsonProperty("municipal") MUNICIPAL
    }

    public enum Cost {
        @JsonProperty("free") FREE,
        @JsonProperty("paid") PAID,
        @JsonProperty("mixed") MIXED,
        @JsonProperty("unknown") UNKNOWN
    }

    public enum Precision {
        @JsonProperty("exact") EXACT,
        @JsonProperty("approximate") APPROXIMATE
    }

    /** Only a place with VERIFIED coordinates is drawn on the map; otherwise it is only in the list */
    public enum CoordinateStatus {
        @JsonProperty("verified") VERIFIED,
        @JsonProperty("unverified") UNVERIFIED
    }

    public enum AppointmentMode {
        @JsonProperty("required") REQUIRED,
        @JsonProperty("recommended") RECOMMENDED,
        @JsonProperty("not-required") NOT_REQUIRED,
        @JsonProperty("unknown") UNKNOWN
    }

    /** Only VERIFIED resources whose review date hasn't arrived are shown to people */
    public enum Status {
        @JsonProperty("verified") VERIFIED,
        @JsonProperty("needs-review") NEEDS_REVIEW,
        @JsonProperty("unverified") UNVERIFIED,
        @JsonProperty("outdated") OUTDATED,
        @JsonProperty("disputed") DISPUTED
    }

    public record SectionRef(String category, String section) {
    }

    /**
     * @param dial digits only (with + if international): what is dialed, and what numbers are compared by
     * @param display how it is written on screen
     * @param scope own coverage, when it differs from the resource's
     * @param hours own hours, when they differ from the resource's
     */
    public record Contact(ContactType type, String dial, String display, String label, Coverage scope, Hours hours) {
    }

    /** @param provinces ISO 3166-2:AR codes (AR-C, AR-B...); areas: ids of taxonomy.json (amba, ugl-rosario...) */
    public record Coverage(CoverageLevel level, List<String> provinces, List<String> areas, String note) {

        public Coverage {
            provinces = provinces == null ? List.of() : List.copyOf(provinces);
            areas = areas == null ? List.of() : List.copyOf(areas);
        }
    }

    /** Who runs the establishment (not where it serves: that is the coverage) */
    public record Jurisdiction(String level, String province, String organization, String note) {
    }

    /** A resource or service whose hours are unknown has no Hours at all (null): it is never assumed to be open 24 h */
    public record Hours(boolean open24h, List<Schedule> schedule, String note) {

        public Hours {
            schedule = schedule == null ? List.of() : List.copyOf(schedule);
        }
    }

    /** @param days 0 = Sunday … 6 = Saturday (same as java.util Date.getDay); from, to: "HH:mm" */
    public record Schedule(List<Integer> days, String from, String to) {

        public Schedule {
            days = days == null ? List.of() : List.copyOf(days);
        }
    }

    /** @param reference how to get there, or where it is inside the premises */
    public record Address(String street, String number, String neighborhood, String locality, String department,
                          String province, String postalCode, String reference, Georef georef) {
    }

    /** Ids of the Georef API (datos.gob.ar) */
    public record Georef(String provinceId, String departmentId, String localityId) {
    }

    /**
     * @param method where the point came from (taxonomy.coordinateMethods)
     * @param verifiedAt YYYY-MM-DD
     */
    public record Coordinates(double lat, double lng, Precision precision, CoordinateStatus status, String method,
                              String verifiedAt, String verifiedBy, String note) {
    }

    /** @param retrievedAt YYYY-MM-DD, the day the source was consulted or downloaded */
    public record Source(String organization, String url, String retrievedAt, String license, String note) {
    }

    /** @param verifiedAt, nextReviewDue YYYY-MM-DD; from nextReviewDue on, the resource stops being shown */
    public record Verification(Status status, String verifiedAt, String verifiedBy, String nextReviewDue, String notes) {
    }

    public record Display(Integer emergencyBarOrder) {
    }

    /** @param howTo how the appointment is requested */
    public record Appointment(AppointmentMode mode, String howTo, String url) {
    }

    /**
     * One thing the place offers, as it comes in the generated file: resolved.
     *
     * @param type taxonomy.serviceTypes (vaccination, dentistry...)
     * @param hours null when they are not known
     * @param contacts the service's own contacts, besides the place's
     * @param verification the service's own, or the place's when it has none of its own
     * @param categories derived from the type
     */
    public record Service(
            String id,
            String type,
            String name,
            String description,
            Hours hours,
            Cost cost,
            String costNote,
            List<String> requirements,
            List<String> audience,
            Appointment appointment,
            List<Contact> contacts,
            Source source,
            Verification verification,
            List<String> categories) {

        public Service {
            requirements = requirements == null ? List.of() : List.copyOf(requirements);
            audience = audience == null ? List.of() : List.copyOf(audience);
            contacts = contacts == null ? List.of() : List.copyOf(contacts);
            categories = categories == null ? List.of() : List.copyOf(categories);
        }
    }
}
