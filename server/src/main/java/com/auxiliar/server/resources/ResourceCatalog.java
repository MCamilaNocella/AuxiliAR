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
 * The verified resources (help lines, services, centers), read from data/resources.json, which is generated
 * from the client's dataset (client/src/data/resources: npm run resources:sync).
 *
 * It is the check of what Auxi may show: a number only counts if a resource with it is verified and its review
 * date hasn't arrived ({@link #findCurrentByDial}). The file is validated at startup (ids and numbers unique,
 * verified resources with their proof): if it is wrong the server doesn't start, instead of serving bad data.
 *
 * Nothing uses it yet: HelpNumbers (prompts/numeros.md) is still what Auxi's numbers come from.
 */
@Component
public class ResourceCatalog {

    /** Version of the dataset format this code understands (taxonomy.json) */
    static final int SCHEMA_VERSION = 1;
    /** Review dates are days in Argentina, wherever the server runs */
    private static final ZoneId ARGENTINA = ZoneId.of("America/Argentina/Buenos_Aires");
    private static final Pattern ID = Pattern.compile("[a-z0-9]+(-[a-z0-9]+)*");
    private static final Pattern DIAL = Pattern.compile("\\+?[0-9]{3,15}");

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

    /** The resource with that number, current or not (compares digits only: "0800 333 0160" = "0800-333-0160") */
    public Optional<HealthResource> findByDial(String number) {
        String key = dialKey(number);
        if (key.isEmpty()) {
            return Optional.empty();
        }
        return resources.stream()
                .filter(resource -> resource.contacts().stream().anyMatch(contact -> dialKey(contact.dial()).equals(key)))
                .findFirst();
    }

    /** What Auxi's numbers are checked against: the resource with that number, only if it can be shown today */
    public Optional<HealthResource> findCurrentByDial(String number) {
        return findByDial(number).filter(this::isCurrent);
    }

    /** The resources that can be shown to people today */
    public List<HealthResource> current() {
        return resources.stream().filter(this::isCurrent).toList();
    }

    public boolean isCurrent(HealthResource resource) {
        return isCurrent(resource, LocalDate.now(clock));
    }

    /** Verified, and its review date hasn't arrived: from nextReviewDue on it stops being shown until it is verified again */
    public boolean isCurrent(HealthResource resource, LocalDate day) {
        HealthResource.Verification verification = resource.verification();
        return verification.status() == HealthResource.Status.VERIFIED
                && !blank(verification.verifiedAt())
                && !blank(verification.nextReviewDue())
                && day.isBefore(LocalDate.parse(verification.nextReviewDue()));
    }

    /** Emergency or not is the kind: there is no separate flag to keep in step with it */
    public static boolean isEmergency(HealthResource resource) {
        return resource.kind() == HealthResource.Kind.EMERGENCY;
    }

    /** Digits only, so the same number written in different ways matches */
    static String dialKey(String number) {
        return number == null ? "" : number.replaceAll("\\D", "");
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
        Map<String, String> dials = new HashMap<>();
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
            if (resource.contacts().isEmpty()) {
                problems.add(where + ": necesita al menos un contacto");
            }
            for (HealthResource.Contact contact : resource.contacts()) {
                if (contact.dial() == null || !DIAL.matcher(contact.dial()).matches()) {
                    problems.add(where + ": número con formato inválido: " + (contact.dial()));
                } else {
                    String previous = dials.put(dialKey(contact.dial()), where);
                    if (previous != null) {
                        problems.add(where + ": el número " + contact.dial() + " ya está en " + previous);
                    }
                }
            }
            validateVerification(resource, where, problems);
        }

        if (!problems.isEmpty()) {
            throw new IllegalStateException("data/resources.json inválido:\n - " + String.join("\n - ", problems));
        }
    }

    private static void validateVerification(HealthResource resource, String where, List<String> problems) {
        HealthResource.Verification verification = resource.verification();
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
            if (resource.source() == null || blank(resource.source().url())) {
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
