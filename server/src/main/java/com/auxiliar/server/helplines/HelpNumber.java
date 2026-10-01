package com.auxiliar.server.helplines;

import java.io.Serializable;

/**
 * A free help line of Argentina, from the table in prompts/numeros.md.
 *
 * @param number as people dial it (e.g. "107", "0800-333-0160")
 * @param name short name, used on the call button
 * @param zone where it works ("Todo el país", "Solo CABA y Gran Buenos Aires"...)
 */
public record HelpNumber(String number, String name, String zone, String use, String hours) implements Serializable {
}
