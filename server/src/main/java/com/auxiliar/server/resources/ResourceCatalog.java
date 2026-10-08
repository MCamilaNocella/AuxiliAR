package com.auxiliar.server.resources;

import java.io.IOException;
import java.io.InputStream;
import java.time.Clock;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import tools.jackson.databind.json.JsonMapper;

/**
 * The verified resources (help lines, places and their services), read from data/resources.json, which is generated
 * from the client's dataset (client/src/data/resources: npm run resources:sync).
 *
 * It is the check of what Auxi may show: a number only counts if a resource with it is verified and its review
 * date hasn't arrived ({@link #findCurrentByDial}). The file is validated at startup (ids and numbers unique,
 * verified resources with their proof, services and coordinates well formed): if it is wrong the server doesn't
 * start, instead of serving bad data.
 *
 * <p>What "current" means. A resource is current when it is verified and its review date hasn't arrived. A place is
 * shown when it is current and has at least one current service; a service is current when its place is and its own
 * verification (or the one it inherits) is. A place is drawn on the map only if its coordinates are verified.
 *
 * Nothing uses it yet: HelpNumbers (prompts/numeros.md) is still what Auxi's numbers come from.
 */
@Component
public class ResourceCatalog {

    /** Version of the dataset format this code understands (taxonomy.json) */
    static final int SCHEMA_VERSION = 2;
    /** Review dates are days in Argentina, wherever the server runs */
    private static final ZoneId ARGENTINA = ZoneId.of("America/Argentina/Buenos_Aires");
    private static final Pattern ID = Pattern.compile("[a-z0-9]+(-[a-z0-9]+)*");
    private static final Pattern DIAL = Pattern.compile("\\+?[0-9]{3,15}");
    private static final Pattern EXTERNAL_ID_KEY = Pattern.compile("[a-z][a-z0-9-]*");
    /** Rough box around Argentina: catches latitude and longitude swapped or mistyped */
    private static final double MIN_LAT = -56;
    private static final double MAX_LAT = -21;
    private static final double MIN_LNG = -74;
    private static final double MAX_LNG = -53;

    private final List<HealthResource> resources;
    private final Clock clock;

    @Autowired
    public ResourceCatalog(JsonMapper jsonMapper, @Value("classpath:data/resources.json") Resource file) throws IOException {
        this(read(jsonMapper, file), Clock.system(ARGENTINA));
    }

    /** For tests: a dataset already read and the clock that says what day it is */
    ResourceCatalog(ResourceDataset dataset, Clock clock) {
        validate(dataset);
        this.resources = List.copyOf(dataset.resources());
        this.clock = clock;
    }

    private static ResourceDataset read(JsonMapper jsonMapper, Resource file) throws IOException {
        try (InputStream input = file.getInputStream()) {
            return jsonMapper.readValue(input, ResourceDataset.class);
        }
    }

    /** Every resource, whatever its verification status */
    public List<HealthResource> all() {
        return resources;
    }

    public Optional<HealthResource> findById(String id) {
        return resources.stream().filter(resource -> resource.id().equals(id)).findFirst();
    }

    /** The first resource with that number (its own, or one of its services'), current or not. Compares digits only */
    public Optional<HealthResource> findByDial(String number) {
        String key = dialKey(number);
        if (key.isEmpty()) {
            return Optional.empty();
        }
        return resources.stream().filter(resource -> hasDial(allContacts(resource), key)).findFirst();
    }

    /**
     * What Auxi's numbers are checked against: the first resource with that number that can be shown today. Several
     * places can share a number, so one that has expired doesn't hide another that is current; a service's own
     * number only counts while that service is current.
     */
    public Optional<HealthResource> findCurrentByDial(String number) {
        return findAllCurrentByDial(number).stream().findFirst();
    }

    /** Every resource with that number that can be shown today */
    public List<HealthResource> findAllCurrentByDial(String number) {
        String key = dialKey(number);
        if (key.isEmpty()) {
            return List.of();
        }
        LocalDate today = today();
        return resources.stream()
                .filter(resource -> isCurrent(resource, today))
                .filter(resource -> hasDial(currentContacts(resource, today), key))
                .toList();
    }

    /** The resources that can be shown to people today (a place only if it has a current service) */
    public List<HealthResource> current() {
        LocalDate today = today();
        return resources.stream().filter(resource -> isShown(resource, today)).toList();
    }

    /**
     * The help lines (not the places) that are verified but whose review date has arrived: they are still shown and still
     * answered with, because a number a person may need must not vanish, but nobody has checked them again, so they are
     * not presented as checked.
     */
    public List<HealthResource> uncheckedLines() {
        LocalDate today = today();
        return resources.stream()
                .filter(resource -> resource.kind() != HealthResource.Kind.SERVICE)
                .filter(resource -> resource.verification() != null && resource.verification().status() == HealthResource.Status.VERIFIED)
                .filter(resource -> !isCurrent(resource, today))
                .toList();
    }

    /** The places (resources with services) that can be shown today */
    public List<HealthResource> currentPlaces() {
        return current().stream().filter(resource -> !resource.services().isEmpty()).toList();
    }

    /** In a category: a place by a current service of that category, any other resource by its own categories */
    public List<HealthResource> currentByCategory(String category) {
        LocalDate today = today();
        return resources.stream()
                .filter(resource -> isShown(resource, today))
                .filter(resource -> resource.services().isEmpty()
                        ? resource.categories().contains(category)
                        : currentServices(resource, today).stream().anyMatch(service -> service.categories().contains(category)))
                .toList();
    }

    /** The places that can be shown today and drawn on the map */
    public List<HealthResource> currentMappablePlaces() {
        return currentPlaces().stream().filter(ResourceCatalog::isMappable).toList();
    }

    public boolean isCurrent(HealthResource resource) {
        return isCurrent(resource, today());
    }

    /** Verified, and its review date hasn't arrived: from nextReviewDue on it stops being shown until it is verified again */
    public boolean isCurrent(HealthResource resource, LocalDate day) {
        return isCurrent(resource.verification(), day);
    }

    /** A service is current when its place is and its own verification (or the one it inherits) is */
    public boolean isServiceCurrent(HealthResource resource, HealthResource.Service service, LocalDate day) {
        return isCurrent(resource, day) && isCurrent(service.verification(), day);
    }

    public List<HealthResource.Service> currentServices(HealthResource resource) {
        return currentServices(resource, today());
    }

    public List<HealthResource.Service> currentServices(HealthResource resource, LocalDate day) {
        return resource.services().stream().filter(service -> isServiceCurrent(resource, service, day)).toList();
    }

    public LocalDate today() {
        return LocalDate.now(clock);
    }

    /** Emergency or not is the kind: there is no separate flag to keep in step with it */
    public static boolean isEmergency(HealthResource resource) {
        return resource.kind() == HealthResource.Kind.EMERGENCY;
    }

    /** Whether a place can be drawn on the map: its coordinates were verified (an address alone only goes in the list) */
    public static boolean isMappable(HealthResource resource) {
        return resource.coordinates() != null && resource.coordinates().status() == HealthResource.CoordinateStatus.VERIFIED;
    }

    /** What the resource shows up under: derived from its services for a place, its own categories for the rest */
    public static List<String> categoriesOf(HealthResource resource) {
        return resource.services().isEmpty() ? resource.categories() : resource.derivedCategories();
    }

    /** Digits only, so the same number written in different ways matches */
    static String dialKey(String number) {
        return number == null ? "" : number.replaceAll("\\D", "");
    }

    private static boolean isCurrent(HealthResource.Verification verification, LocalDate day) {
        return verification != null
                && verification.status() == HealthResource.Status.VERIFIED
                && !blank(verification.verifiedAt())
                && !blank(verification.nextReviewDue())
                && day.isBefore(LocalDate.parse(verification.nextReviewDue()));
    }

    private boolean isShown(HealthResource resource, LocalDate day) {
        return isCurrent(resource, day) && (resource.services().isEmpty() || !currentServices(resource, day).isEmpty());
    }

    /** The contacts of the resource and of all its services */
    private static List<HealthResource.Contact> allContacts(HealthResource resource) {
        List<HealthResource.Contact> contacts = new ArrayList<>(resource.contacts());
        resource.services().forEach(service -> contacts.addAll(service.contacts()));
        return contacts;
    }

    /** The contacts of the resource and of its current services */
    private List<HealthResource.Contact> currentContacts(HealthResource resource, LocalDate day) {
        List<HealthResource.Contact> contacts = new ArrayList<>(resource.contacts());
        currentServices(resource, day).forEach(service -> contacts.addAll(service.contacts()));
        return contacts;
    }

    private static boolean hasDial(List<HealthResource.Contact> contacts, String key) {
        return contacts.stream().anyMatch(contact -> dialKey(contact.dial()).equals(key));
    }

    private static boolean blank(String text) {
        return text == null || text.isBlank();
    }

    private static void validate(ResourceDataset dataset) {
        List<String> problems = new ArrayList<>();
        if (dataset.schemaVersion() != SCHEMA_VERSION) {
            problems.add("schemaVersion " + dataset.schemaVersion() + ": este servidor entiende la versión " + SCHEMA_VERSION);
        }

        Set<String> ids = new HashSet<>();
        // number → who uses it (resource id → kind). Only places (kind SERVICE) may share a number
        Map<String, Map<String, HealthResource.Kind>> dialOwners = new LinkedHashMap<>();
        Map<String, String> dialWhere = new HashMap<>();
        Map<String, String> externalIds = new HashMap<>();

        for (HealthResource resource : dataset.resources()) {
            String where = String.valueOf(resource.id());
            if (resource.id() == null || !ID.matcher(resource.id()).matches()) {
                problems.add("id inválido: " + resource.id());
            } else if (!ids.add(resource.id())) {
                problems.add(where + ": id repetido");
            }
            if (blank(resource.name())) {
                problems.add(where + ": falta name");
            }
            if (resource.kind() == null) {
                problems.add(where + ": falta kind");
            }
            boolean place = resource.kind() == HealthResource.Kind.SERVICE;
            if (!place && resource.contacts().isEmpty()) {
                problems.add(where + ": un recurso que no es un servicio necesita al menos un contacto");
            }
            if (!resource.services().isEmpty()) {
                if (!place) {
                    problems.add(where + ": las prestaciones (services) solo van en recursos de tipo service");
                }
                if (blank(resource.facilityType())) {
                    problems.add(where + ": un establecimiento con services necesita facilityType");
                }
            }

            for (HealthResource.Contact contact : resource.contacts()) {
                validateContact(resource, contact, where, problems, dialOwners, dialWhere);
            }
            validateServices(resource, where, problems, dialOwners, dialWhere);
            validateVerification(resource.verification(), resource.source(), where, problems);
            validateCoordinates(resource.coordinates(), where, problems);

            resource.externalIds().forEach((key, value) -> {
                if (!EXTERNAL_ID_KEY.matcher(key).matches()) {
                    problems.add(where + ": externalIds: la clave \"" + key + "\" tiene que estar en minúsculas y guiones");
                }
                String previous = externalIds.put(key + ":" + value, where);
                if (previous != null && !previous.equals(where)) {
                    problems.add(where + ": externalIds " + key + " \"" + value + "\" ya está en " + previous);
                }
            });
        }

        dialOwners.forEach((key, owners) -> {
            if (owners.size() > 1 && owners.values().stream().anyMatch(kind -> kind != HealthResource.Kind.SERVICE)) {
                problems.add(dialWhere.get(key) + ": el número " + key + " está en más de un recurso (" + String.join(", ", owners.keySet())
                        + ") y alguno no es un servicio: solo los lugares pueden compartir un número");
            }
        });

        if (!problems.isEmpty()) {
            throw new IllegalStateException("data/resources.json inválido:\n - " + String.join("\n - ", problems));
        }
    }

    private static void validateContact(HealthResource resource, HealthResource.Contact contact, String where, List<String> problems,
                                        Map<String, Map<String, HealthResource.Kind>> dialOwners, Map<String, String> dialWhere) {
        if (contact.dial() == null || !DIAL.matcher(contact.dial()).matches()) {
            problems.add(where + ": número con formato inválido: " + contact.dial());
            return;
        }
        String key = dialKey(contact.dial());
        dialOwners.computeIfAbsent(key, ignored -> new LinkedHashMap<>()).put(String.valueOf(resource.id()), resource.kind());
        dialWhere.putIfAbsent(key, where);
    }

    private static void validateServices(HealthResource resource, String where, List<String> problems,
                                         Map<String, Map<String, HealthResource.Kind>> dialOwners, Map<String, String> dialWhere) {
        Set<String> serviceIds = new HashSet<>();
        for (HealthResource.Service service : resource.services()) {
            String serviceWhere = where + " › " + service.id();
            if (service.id() == null || !ID.matcher(service.id()).matches()) {
                problems.add(serviceWhere + ": id de prestación inválido");
            } else if (!serviceIds.add(service.id())) {
                problems.add(serviceWhere + ": id repetido en este establecimiento");
            }
            if (blank(service.type())) {
                problems.add(serviceWhere + ": falta type");
            }
            for (HealthResource.Contact contact : service.contacts()) {
                validateContact(resource, contact, serviceWhere, problems, dialOwners, dialWhere);
            }
            // The service's verification comes resolved (its own, or the place's); its source too
            HealthResource.Source source = service.source() != null ? service.source() : resource.source();
            validateVerification(service.verification(), source, serviceWhere, problems);
        }
    }

    private static void validateCoordinates(HealthResource.Coordinates coordinates, String where, List<String> problems) {
        if (coordinates == null) {
            return;
        }
        if (coordinates.lat() < MIN_LAT || coordinates.lat() > MAX_LAT || coordinates.lng() < MIN_LNG || coordinates.lng() > MAX_LNG) {
            problems.add(where + ": el punto (" + coordinates.lat() + ", " + coordinates.lng() + ") está fuera de Argentina: ¿lat y lng invertidas?");
        }
        if (coordinates.status() == null) {
            problems.add(where + ": coordinates sin status");
            return;
        }
        date(coordinates.verifiedAt(), "coordinates.verifiedAt", where, problems);
        if (coordinates.status() == HealthResource.CoordinateStatus.VERIFIED) {
            if (blank(coordinates.method())) {
                problems.add(where + ": unas coordenadas verificadas necesitan method (de dónde salió el punto)");
            }
            if (blank(coordinates.verifiedAt())) {
                problems.add(where + ": unas coordenadas verificadas necesitan verifiedAt");
            }
            if (blank(coordinates.verifiedBy())) {
                problems.add(where + ": unas coordenadas verificadas necesitan verifiedBy");
            }
        }
    }

    private static void validateVerification(HealthResource.Verification verification, HealthResource.Source source, String where, List<String> problems) {
        if (verification == null || verification.status() == null) {
            problems.add(where + ": falta verification.status");
            return;
        }
        LocalDate verifiedAt = date(verification.verifiedAt(), "verifiedAt", where, problems);
        LocalDate nextReviewDue = date(verification.nextReviewDue(), "nextReviewDue", where, problems);

        if (verification.status() == HealthResource.Status.VERIFIED) {
            if (verifiedAt == null) {
                problems.add(where + ": un recurso verificado necesita verifiedAt");
            }
            if (blank(verification.verifiedBy())) {
                problems.add(where + ": un recurso verificado necesita verifiedBy");
            }
            if (nextReviewDue == null) {
                problems.add(where + ": un recurso verificado necesita nextReviewDue");
            }
            if (source == null || blank(source.url())) {
                problems.add(where + ": un recurso verificado necesita source.url");
            }
        }
        if (verifiedAt != null && nextReviewDue != null && !nextReviewDue.isAfter(verifiedAt)) {
            problems.add(where + ": nextReviewDue tiene que ser posterior a verifiedAt");
        }
    }

    /** The day written YYYY-MM-DD, or null if it's missing; an impossible date ("2026-02-30") is a problem */
    private static LocalDate date(String text, String field, String where, List<String> problems) {
        if (blank(text)) {
            return null;
        }
        try {
            return LocalDate.parse(text);
        } catch (DateTimeParseException exception) {
            problems.add(where + ": " + field + " no es una fecha real: " + text);
            return null;
        }
    }
}
