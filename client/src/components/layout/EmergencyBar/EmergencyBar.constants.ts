export const EMERGENCY_SECTION_ID = "urgencias"
export const EMERGENCY_HEADING_ID = "urgencias-titulo"

/*
 * Grillas que se adaptan al tamaño de texto de "Ver mejor": cada columna necesita
 * un ancho mínimo en rem (crece con el texto); si no entra, pasan a menos columnas.
 * Números: hasta 3 por fila (apilados en mobile, en fila desde sm).
 * Guías: hasta 2 por fila ("Atragantamiento" mide ~10rem).
 */
export const NUMBERS_GRID =
  "grid-cols-[repeat(auto-fill,minmax(min(100%,max(6rem,calc((100%_-_1rem)/3))),1fr))] sm:grid-cols-[repeat(auto-fill,minmax(min(100%,max(9rem,calc((100%_-_1rem)/3))),1fr))]"
export const GUIDES_GRID = "grid-cols-[repeat(auto-fill,minmax(min(100%,max(10rem,calc((100%_-_0.5rem)/2))),1fr))]"
