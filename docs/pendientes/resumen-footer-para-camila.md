# Resumen para Camila: fusión de `origin/main` en la rama de demo

**Su aprobación sigue pendiente.** Rama: `release/demo-candidate-2026-10-14` (la fusión está en el commit `92289cd`). Se fusionó `origin/main` (46f1a86, su trabajo de layout y accesibilidad) sin sobrescribir nada suyo y sin push.

## Un conflicto, en `client/src/components/layout/Footer/Footer.tsx`
- La rama tenía: «…profesional. Ante una emergencia, llamá al `{GENERAL_EMERGENCY_NUMBER}`.»
- Su versión tenía: «…Ante una emergencia, llamá al **911** o al **107**» escrito a mano, dentro de un `<span className="block sm:inline">`.
- **Resolución:** se conserva **todo su diseño** (contenedor `page-container`, el nombre en su propia línea en móvil, la frase de emergencia en una línea aparte, «Sobre AuxiliAR» aparte) y el número sale de `GENERAL_EMERGENCY_NUMBER` (`@/data/emergency`, la fuente única ya usada por la rama). **No hay ningún número escrito a mano.** Consecuencia visible: el pie dice solo el número único de emergencias («911»), no «911 o 107», que es lo que ya decía la rama antes de la fusión.
- Lo que hay que mirar: esa frase del pie, en `Footer.tsx` (líneas ~16-21).

## `EmergencyBar.tsx`
Un solo cambio, que viene de su rama sin conflicto: `mx-auto … max-w-360 … px-4 sm:px-6 lg:px-8` → `page-container` (solo clases de ancho y márgenes). El contenido, los números, los textos y la lógica del componente **no cambian**.

## Qué se pide
Que mire el pie en 320, 390 y 1280 px y confirme que (1) su diseño quedó como lo pensó y (2) está de acuerdo con que el pie tome el número de la fuente única. Si no, el diff mínimo a revertir es solo la frase de emergencia del pie.
