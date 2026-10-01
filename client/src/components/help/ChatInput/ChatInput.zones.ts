/*
 * Simulated zone search: a fixed list until there's a database or a places API.
 * Keep the async signature so swapping it for a real request doesn't change the chat.
 */

const ZONES = [
  // CABA
  "Agronomía, CABA", "Almagro, CABA", "Balvanera, CABA", "Barracas, CABA", "Belgrano, CABA", "Boedo, CABA",
  "Caballito, CABA", "Chacarita, CABA", "Colegiales, CABA", "Constitución, CABA", "Flores, CABA", "Floresta, CABA",
  "La Boca, CABA", "Liniers, CABA", "Mataderos, CABA", "Monserrat, CABA", "Núñez, CABA", "Palermo, CABA",
  "Parque Patricios, CABA", "Pompeya, CABA", "Recoleta, CABA", "Retiro, CABA", "Saavedra, CABA", "San Cristóbal, CABA",
  "San Nicolás, CABA", "San Telmo, CABA", "Villa Crespo, CABA", "Villa del Parque, CABA", "Villa Devoto, CABA",
  "Villa Lugano, CABA", "Villa Urquiza, CABA",
  // Gran Buenos Aires
  "Avellaneda, Buenos Aires", "Lanús, Buenos Aires", "Lomas de Zamora, Buenos Aires", "Quilmes, Buenos Aires",
  "La Matanza, Buenos Aires", "Morón, Buenos Aires", "Merlo, Buenos Aires", "Moreno, Buenos Aires",
  "San Isidro, Buenos Aires", "Vicente López, Buenos Aires", "Tigre, Buenos Aires", "San Martín, Buenos Aires",
  "Tres de Febrero, Buenos Aires", "Florencio Varela, Buenos Aires", "Berazategui, Buenos Aires", "Pilar, Buenos Aires",
  "La Plata, Buenos Aires", "Mar del Plata, Buenos Aires", "Bahía Blanca, Buenos Aires",
  // Other cities
  "Villa Balvanera, Córdoba", "Córdoba, Córdoba", "Villa Carlos Paz, Córdoba", "Río Cuarto, Córdoba",
  "Rosario, Santa Fe", "Santa Fe, Santa Fe", "Mendoza, Mendoza", "San Miguel de Tucumán, Tucumán", "Salta, Salta",
  "San Salvador de Jujuy, Jujuy", "Resistencia, Chaco", "Corrientes, Corrientes", "Posadas, Misiones",
  "Paraná, Entre Ríos", "Santiago del Estero, Santiago del Estero", "San Juan, San Juan", "San Luis, San Luis",
  "Neuquén, Neuquén", "Santa Rosa, La Pampa", "Viedma, Río Negro", "Bariloche, Río Negro", "Rawson, Chubut",
  "Comodoro Rivadavia, Chubut", "Río Gallegos, Santa Cruz", "Ushuaia, Tierra del Fuego", "La Rioja, La Rioja",
  "San Fernando del Valle de Catamarca, Catamarca", "Formosa, Formosa",
]

const MAX_RESULTS = 5

/** Lowercase without accents, so "nunez" finds "Núñez" */
const normalize = (text: string) => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()

/** Zones whose name contains the query; the ones starting with it first */
export const searchZones = async (query: string): Promise<string[]> => {
  const needle = normalize(query.trim())
  if (needle.length < 2) return []
  const matches = ZONES.filter((zone) => normalize(zone).includes(needle))
  const startsFirst = (zone: string) => (normalize(zone).startsWith(needle) ? 0 : 1)
  return matches.sort((a, b) => startsFirst(a) - startsFirst(b)).slice(0, MAX_RESULTS)
}
