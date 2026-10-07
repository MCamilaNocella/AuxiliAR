package com.auxiliar.server.resources;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * A verified help resource (help line, service, center), as the client's dataset defines it
 * (client/src/data/resources, schema in resource.schema.json). Read from the generated data/resources.json.
 * Only id, name, kind, contacts and verification are always there: the rest may be missing (null or an empty list).
 * Whether it is an emergency is the kind (see {@link ResourceCatalog#isEmergency}).
 */
public record HealthResource(
        String id,
        String name,
        String shortName,
        Kind kind,
        String description,
        String whenToUse,
        List<String> categories,
        List<SectionRef> sections,
        List<Contact> contacts,
        Coverage coverage,
        Hours hours,
        Cost cost,
        String costNote,
        List<String> requirements,
        List<String> audience,
        Address address,
        Coordinates coordinates,
        Source source,
        Verification verification,
        List<String> aliases,
        Display display) {

    public HealthResource {
        categories = orEmpty(categories);
        sections = orEmpty(sections);
        contacts = orEmpty(contacts);
        requirements = orEmpty(requirements);
        audience = orEmpty(audience);
        aliases = orEmpty(aliases);
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

    /** A resource whose hours are unknown has no Hours at all (null): it is never assumed to be open 24 h */
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

    public record Address(String street, String locality, String province, String postalCode) {
    }

    public record Coordinates(double lat, double lng, Precision precision) {
    }

    public record Source(String organization, String url, String note) {
    }

    /** @param verifiedAt, nextReviewDue YYYY-MM-DD; from nextReviewDue on, the resource stops being shown */
    public record Verification(Status status, String verifiedAt, String verifiedBy, String nextReviewDue, String notes) {
    }

    public record Display(Integer emergencyBarOrder) {
    }
}
