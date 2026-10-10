# Versión local de presentación del 14/10/2026

**Rama local:** `demo/presentation-2026-10-14` (derivada de `review/vaccination-calendar-ux-collapsible`, `a948c22`). **Solo para mostrar al equipo en una computadora local.** No está integrada a ninguna rama compartida ni publicada: no hubo push, PR ni merge, y `main` y `origin/main` no se tocaron (`main` sigue en `4409451`; los dos stashes están intactos).

## Qué incluye
- **Todo lo aprobado antes:** la navegación y las seis categorías de la ronda de UX, el mapa con la regla de gratuidad documentada, los ocho estados vacíos, Más recursos, «Si muere tu perro o gato», métodos anticonceptivos, rutas, 404 propia, Footer con el diseño de Camila, Emergencias y Auxi **sin cambios**. La rama contiene, en línea, `feature/demo-ux-round2`, la auditoría, `feature/content-round3`, la revisión de calidad, la demo de contenido y el calendario (comprobado con `git merge-base`).
- **El Calendario Nacional de Vacunación 2026 completo** (ocho etapas), en Salud general › Calendario de vacunación, con el aviso de «En desarrollo · pendiente de validación profesional» **arriba de cada etapa**. Mantiene la nota general, los recuadros «Para confirmar en la fuente oficial o en el vacunatorio», las fuentes y todas las advertencias.
- **El único cambio de esta rama** respecto de `a948c22` es ese aviso (en `Section5.constants.ts` y `Section5.content.tsx`) y su prueba. **No se modificaron recomendaciones clínicas ni se quitó ninguna advertencia.**

## Cómo abrir la demo
En una terminal (PowerShell o Git Bash):

```
cd "C:\Users\Familia\Repo AuxiliAR\AuxiliAR"
git checkout demo/presentation-2026-10-14
cd client
npm install        # solo la primera vez
npm run build
npm run preview    # abre http://localhost:4173/
```

- **Recomendado:** `npm run build` + `npm run preview`. Así **no se exponen las rutas de prototipo** (`/login`, `/auxi-modelos`, `/boceto-chat-personas`), que solo existen en `npm run dev`; en la presentación muestran la página 404 propia (verificado).
- Para ver cómo se ve en un celular: en Chrome, abrir las herramientas de desarrollo (F12) y activar el modo dispositivo con 390 × 844 px. Si preferís un teléfono real, `npm run preview -- --host` lo expone a la red local (solo en una red de confianza).
- **Auxi:** no responde consultas de salud (sin credenciales de IA ni servidor). Su burbuja puede tapar texto en celular: cerrala con su ✕ al empezar y no recargues la página ([detalle](../investigacion/ronda-contenido-3/auxi-superposicion.md)).

## Recorrido sugerido (≈ 10 minutos)
| # | Ruta | Qué mostrar |
|---|---|---|
| 1 | `/` | Las seis categorías y la barra de Emergencia, con el panel de Primeros auxilios al lado de los números. |
| 2 | `/centros` | Mapa AuxiliAR (solo prestaciones con gratuidad documentada), una ficha, «Cómo verificamos los datos». |
| 3 | `/centros?vista=lista&filtro=mental-health` | Estado vacío transparente. |
| 4 | `/temas/salud-general?seccion=section-5` | **Calendario de vacunación**: decir en voz alta que está **en desarrollo y pendiente de validación profesional**; recorrer las ocho etapas; mostrar «15 a 64 años» con sus bloques desplegables y un recuadro «Para confirmar…». |
| 5 | `/recursos?seccion=section-2` y `?seccion=section-3` | Cómo pedir turno en un CeSAC; preguntas frecuentes. |
| 6 | `/temas/animales?seccion=section-4` | Qué hacer si muere tu perro o gato. |
| 7 | `/primeros-auxilios` | Guías de primeros auxilios. |
| 8 | `/mi-salud` | «En construcción»: decirlo así. |

## Qué decir sobre el calendario
- «Es un resumen informativo del Calendario Nacional oficial, **todavía no validado por profesionales de la salud**. No es una herramienta clínica.»
- «Donde las fuentes oficiales se contradicen o hace falta una indicación profesional, la página lo dice y manda a la fuente o al vacunatorio.»
- «Está pensado para revisarlo con el equipo antes de publicarlo.»

## Pendientes de validación profesional (siguen abiertos; nada se marcó como validado)
- **Calendario:** las 20 decisiones clínicas, legales y de cotejo de [matriz-p1-p16-calendario.md](../investigacion/ronda-contenido-3/matriz-p1-p16-calendario.md) (P1 a P16, Ley 27.491 art. 8, atribución de licencia y cotejo humano de los dos afiches PDF).
- **Fuera del calendario**, prioridad A de [afirmaciones-pendientes-de-validacion.md](../investigacion/ronda-contenido-3/afirmaciones-pendientes-de-validacion.md): anticoncepción de emergencia, PEP y preservativo vaginal; DIU y anticoncepción quirúrgica; rabia («¿mordió a alguien?»); Ley 153 y obligatoriedad de vacunas en Más recursos; guardia oftalmológica (estado vacío); Ley 27.610; guías de fracturas y de golpes y caídas.
- **Decisión pendiente del equipo para esos fragmentos:** la [propuesta de demo segura](../investigacion/ronda-contenido-3/propuesta-demo-segura.md) (no abrir esos fragmentos u ocultarlos en otra rama). **Esta rama no oculta nada**; el único cambio respecto de la propuesta es que ahora **sí se muestran las ocho etapas del calendario**, identificadas como en desarrollo.
- **Equipo:** aprobación de Camila sobre Footer y EmergencyBar, estado de Auxi, `contextLoads` de Java ([pendientes-de-equipo.md](../investigacion/ronda-contenido-3/pendientes-de-equipo.md)).

## Limitaciones conocidas
- Las páginas oficiales no traen fecha de actualización; las fuentes del calendario se consultaron el 9/10/2026 y las demás el 8 y 9/10/2026.
- El mapa tiene 6 lugares y 9 prestaciones, solo CABA. No están Pasteur ni la consejería de los CeSAC.
- Auxi no conoce las secciones nuevas (su índice de contenidos no se regeneró).
- Los enlaces externos abren pestañas nuevas; los de la ronda respondieron 200 el 9/10 (verificar de nuevo el día de la demo si hay internet).
- Mi salud, los videos y audios, y el chat de Auxi siguen en desarrollo.

## Verificación de esta rama
- `tsc -b`, `build` y `oxlint`: sin errores (1 advertencia que ya existía en `demo-routes.test.mjs`). `npm run test:ci`: sin fallas, con 16 pruebas de la ronda (incluye que cada etapa muestre el aviso de «en desarrollo» y que nada diga que está validado).
- Recorrido automático sobre la versión construida (`npm run preview`) en 390 y 1280 px: **38 rutas × 2 anchos** (inicio, mapa y sus filtros, Mi salud, las cinco secciones de Salud general con las ocho etapas, Salud mental, Salud sexual y ESI, Salud animal, Primeros auxilios, Más recursos, Sobre AuxiliAR), 4 rutas que deben dar 404, 2 redirecciones antiguas y la navegación inferior: **0 fallas** (sin desborde horizontal, sin errores de consola, con la barra de Emergencia presente). Resultado en [capturas/comprobaciones.txt](capturas/comprobaciones.txt); capturas del calendario con el aviso en 320, 390 y 1280 px en [capturas/](capturas/).

## Cómo quitar el aviso de «en desarrollo» (solo después de la validación profesional)
Borrar `DEVELOPMENT_NOTICE` de `Section5.constants.ts` y su uso en `Section5.content.tsx`, y su prueba en `scripts/content-round3.test.mjs`. **No hacerlo antes de resolver los pendientes de la matriz.**
