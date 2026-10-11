# Salud sexual y ESI: cómo se obtuvieron los datos de las fichas (10/10/2026)

Trazabilidad de las fichas de otras provincias, de Fundación Huésped, de los materiales de ESI y de las dos listas de la Ciudad. En las categorías solo hay un aviso breve ("consultada el 10 de octubre de 2026 … AuxiliAR no los verificó"); el detalle está acá y en «Sobre AuxiliAR».

## Método

- Las páginas oficiales se leyeron el 10/10/2026 con una herramienta de lectura automática (resumen generado por modelo). **Nadie del equipo comparó todavía el texto de las fichas con cada página a simple vista.**
- Lo que una página no dice figura como «para confirmar» en la ficha. No se completó con otras fuentes ni con suposiciones.
- Cuando la página muestra fecha de contenido se informa (Tucumán: 19/8/2026); cuando no, no se afirma ninguna.

## Qué NO afirman las fichas

- No afirman que AuxiliAR haya verificado un servicio, un horario ni una gratuidad. La gratuidad se dice siempre como lo que la página dice.
- Los resúmenes de interrupción del embarazo (Buenos Aires, Santa Fe) están **pendientes de validación legal y profesional**.
- Las listas de testeo (69) y de consejerías (62) de la Ciudad se transcribieron tal como las publica el Gobierno de la Ciudad. La lista de consejerías **no confirma que cada sede realice procedimientos de IVE/ILE**: su columna de contacto es el «contacto por IVE/ILE» que la página publica, no necesariamente el teléfono general del centro, y hay datos repetidos entre centros.
- La línea 0800 de salud sexual no es una línea de emergencia; la página del Ministerio no aclara si la llamada es gratuita.

## Dónde está el código

`client/src/content/categories/SexEducation/`: `SexEducation.coverage.ts` (fichas), `SexEducation.lists.ts` (listas), `CoverageCard.tsx`, `CenterList.tsx`, `NationalLine.tsx`. Fuentes: «Sobre AuxiliAR» › Salud sexual y ESI › «Otras provincias, organización civil y materiales de ESI».

## Control de números

`scripts/emergency-consumers.test.mjs` prohíbe números escritos a mano. Solo se eximen, archivo por archivo y número por número, las líneas 0800 de servicios que las páginas oficiales publican (0800-222-3444 y 0800-777-0801 en `SexEducation.coverage.ts`; 0800-222-4837 en `SexEducation.lists.ts`). Cualquier otro número, de emergencia o no, sigue fallando en esos archivos también.
