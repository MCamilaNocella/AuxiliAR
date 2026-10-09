# Informe: ronda de contenido (9/10/2026)

Rama local `feature/content-round3`, derivada de `audit/content-and-links-2026-10` (`1580758`). No se tocó `main`, `origin/main`, Emergencias, teléfonos de emergencia, chatbot, prompt, servidor, componente Auxi ni stashes. No hay push, PR ni merge. Capturas en [capturas/](capturas/) (móvil 390 px y escritorio 1280 px; sin desborde horizontal en ninguna).

## 1. Qué se implementó

| # | Pedido | Resultado | Dónde |
|---|---|---|---|
| 1 | Calendario de vacunación 2026 | Nueva sección **Salud general › Calendario de vacunación** (`section-5`): 8 etapas (embarazo, recién nacidos, hasta 1 año, hasta 2 años, 5, 11, 15 a 64, 65 o más), una a la vez con botones, la etapa abierta va en la URL (`?etapa=`), foco y lectura accesibles, «Recordá», botón a vacunatorios, fuentes y fecha (9/10/2026). El tema «Vacunación» de Controles enlaza al calendario. | `PhysicalHealth/sections/Section5` |
| 2 | Ocho accesos a mapas vacíos | Estado vacío con explicación propia para Salud mental, Salud sexual, Odontología y Guardia oftalmológica: «Todavía no tenemos… con gratuidad documentada. Eso no significa que no existan», qué hacer, enlaces internos y «Ver todas las prestaciones disponibles». Los 8 botones dicen «Ver el mapa» (o «Ver el mapa (odontología)» / «(urgencia oftalmológica)»). Sin líneas ni números de emergencia; no se nombra ningún hospital. | `utils/places/emptyGuides.ts`, `PlacesExplorer` |
| 3 | Más recursos v1 | Ya no es «Próximamente». 4 secciones: **Tus derechos en salud** (Ley 153, salud mental, salud sexual/ESI, vacunas), **Trámites** (Cómo pedir turno en un CeSAC, vacunarte, si te rechazan la atención), **Preguntas frecuentes** (8), **Glosario** (14 términos con fuente). Sin Ley 27.610. | `Resources/` |
| 4 | Atención veterinaria | Nueva sección **Salud animal › Si muere tu perro o gato** («disposición final o cremación», sin costo, 24 h, mayor de edad con DNI; aclara que NO se informa cremación individual ni cenizas; sin horarios del vacunatorio). Ficha de Pasteur actualizada: pasa de «sin confirmar» a «informado como gratuito» en las campañas. | `Animals/sections/Section4`, `Animals.sources.ts` |
| 5 | Salud sexual - ESI | **Anticoncepción y prevención** explica adentro los 9 métodos (con la página del Ministerio de cada uno), preservativo peneano, **«¿Qué es el preservativo vaginal?»** (qué es, cómo se usa, qué tener en cuenta, qué hacer si se rompe, dónde consultar) y las frases de gratuidad del Gobierno de la Ciudad y la Ley 25.673. **No se afirma nada del Hospital Rivadavia.** Huésped queda como «Para leer más». | `SexEducation/sections/Section2` |
| 6 | Enlaces externos | Ver §3. | |

Reutilización sin duplicar: derechos de salud mental, derechos sexuales, «Sobre los datos», la frase de campaña veterinaria y la regla de rechazo de atención son **módulos de una sola copia** (`MentalHealth.rights`, `SexEducation.rights`, `Section2.points`, `CAMPAIGN_NOT_CARE`) que usan la categoría y «Más recursos». Un test verifica que no estén copiados.

## 2. Fuentes (todas oficiales; texto guardado en `docs/investigacion/evidencia`)

- Calendario: 8 páginas por etapa de argentina.gob.ar/salud/vacunas (CC BY 4.0), 9/10/2026.
- Métodos y preservativo vaginal: 10 páginas del Ministerio de Salud (CC BY 4.0), 9/10/2026 → `nacion-metodos-anticonceptivos-y-preservativo-vaginal.txt` (nuevo; la auditoría no había guardado el texto del preservativo vaginal).
- Gratuidad y consejerías: Gobierno de la Ciudad (métodos anticonceptivos; lista de 62 consejerías), 9/10/2026.
- Ley 153 y Ley 27.491 (8/10/2026), turnos CeSAC (8/10/2026), Pasteur (9/10/2026).

## 3. Enlaces externos de contenido

- **Salud sexual - ESI › Anticoncepción:** los 3 enlaces de contenido (test VIH de la Ciudad, preservativos de la Ciudad, guía de Huésped) pasaron a: explicación interna + fuentes oficiales; quedan solo 3 enlaces de **acción/consulta** identificados como externos (lista de centros de testeo, lista de consejerías, línea nacional) y Huésped como complemento.
- **ESI › Dónde buscar atención:** los buscadores de Huésped y las páginas de PBA, Santa Fe y Tucumán quedan **plegados** bajo «Otras páginas para completar la información (se abren fuera de AuxiliAR)».
- **ESI › Derechos:** los materiales de ESI siguen como lectura complementaria (rotulados «complemento»).
- **Salud animal:** los enlaces restantes son la página oficial de cada servicio (fuente) y los hospitales UBA/UNLP (fuente de que son arancelados); la explicación está adentro.

## 4. Pruebas

`tsc -b` sin errores; `oxlint` sin errores (1 advertencia preexistente en `demo-routes.test.mjs`); `npm run build` correcto; `npm run test:ci` **sin fallas** (incluye el nuevo `round3:test`, 9 pruebas: calendario contra la evidencia guardada, estados vacíos sin números, Más recursos sin Ley 27.610 y sin textos copiados, Pasteur no está en los datos). Se actualizaron pruebas que fijaban el estado anterior: botones, Pasteur en «confirmados», «Próximamente» de Más recursos, secciones de Salud general (cuatro: ahora usa el menú de secciones en vez de pestañas), contenido de métodos anticonceptivos (más amplio, con las mismas salvaguardas: sin porcentajes de eficacia, sin «protege» absoluto, sin números de teléfono).

## 5. Decisiones que tomé y conviene revisar

1. **`section-5` para el calendario:** `section-3` de Salud general redirige a Primeros auxilios (compatibilidad antigua), así que no se podía reutilizar.
2. **Salud general pasa a 4 secciones:** en móvil usa el menú desplegable de secciones (como Más recursos) en lugar de pestañas.
3. **Sin resumen para las secciones nuevas** (calendario, «Si muere tu perro o gato», Más recursos): el índice de Auxi (`content-index.json`) es un recurso del servidor y no se regeneró. Consecuencia: **Auxi todavía no sugiere estas páginas.** Regenerarlo (`npm run content:index`) es una decisión de quien mantiene Auxi.
4. **Número 147** (línea de la Ciudad para empadronarse y pedir turno) aparece en «Cómo pedir turno en un CeSAC», tal como en la página oficial y en las fichas del mapa. No es un número de emergencia. Pasteur: se publican la dirección y el conmutador con su horario, tal como figuran en su página.
5. **Estados vacíos sin «Ver números de emergencia»** (pedido expreso). La barra y el menú de Emergencia siguen visibles en toda la página.
6. **Mensajes clínicos en la sección de métodos:** repiten las páginas del Ministerio, incluidas ventanas de tiempo de la anticoncepción de emergencia (12 h / 5 días) y de la PEP (72 h) en el preservativo vaginal. Se omitieron los porcentajes de efectividad por la política vigente.

## 6. Pendientes y aprobaciones

- **Revisión clínica** de: métodos anticonceptivos, preservativo vaginal (incluida la mención de PEP y AHE), calendario (se copió fielmente; verificar vigencia con el PDF 2026-03-10) y texto de rabia/«Si muere tu perro o gato».
- **Revisión legal** de: Más recursos › derechos (Ley 153 y 27.491 resumidas con los artículos 2, 3, 4, 7, 9 y 10) y FAQ «¿Me pueden atender en la Ciudad si no vivo en la Ciudad?».
- Material preparado y no publicado: [propuestas-preparadas-no-publicadas.md](propuestas-preparadas-no-publicadas.md) (videos RCP/DEA/atragantamiento con integración visual, audios de la OMS, Pasteur en el mapa con tipo de servicio nuevo, «Consejería y métodos anticonceptivos» para CeSAC 3/41/47 con borrador).
- **Hospital Rivadavia / preservativos vaginales:** sin fuente; no publicado.
- Heredados: aprobación de Camila (Footer/EmergencyBar), criterio «caminar sin ayuda» en fracturas, propuesta «Auxi — En desarrollo», agenda de Costanera Sur (vence 17/10), `contextLoads` de Java.
- Detenida la tarea: no se integró a ramas compartidas.
