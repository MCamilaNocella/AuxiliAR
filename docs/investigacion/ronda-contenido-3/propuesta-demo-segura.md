# Propuesta de demo segura (afirmaciones de prioridad A sin revisión profesional)

**Principio:** se conservan todas las categorías y su orientación general. Nada de lo que sigue se modificó: es una propuesta para decidir **qué fragmentos específicos se ocultan temporalmente en la versión de demo o no se demuestran** hasta que una persona con formación clínica o legal los valide. **Ninguna prueba automática (ni la comparación con las fuentes, ni la prueba del calendario) sustituye esa revisión:** solo comprueban que el texto no se aparta de lo copiado, no que lo copiado sea correcto, completo y esté vigente.

Los números (1.1, 4.5…) remiten a [afirmaciones-pendientes-de-validacion.md](afirmaciones-pendientes-de-validacion.md); los «#» del calendario, a [calendario-contra-pdf-2026.md](calendario-contra-pdf-2026.md).

## Dos opciones

- **Opción 1 (recomendada, sin tocar el código): no demostrar.** La persona que presenta no abre esos fragmentos. Riesgo: alguien del público puede abrirlos por su cuenta, porque están plegados pero accesibles.
- **Opción 2: ocultarlos en una rama de demo.** Un cambio mínimo y reversible, con aprobación, que quita o pliega solo los fragmentos de la última columna. **No se hizo.** Como la demo es local, la información de seguridad (por ejemplo, plazos de la anticoncepción de emergencia) deja de mostrarse solo en esa copia: **esa rama no debe ir a publicación**.

## Qué mostrar, qué advertir y qué ocultar o no demostrar

| Página | Se puede mostrar | Con advertencia verbal | **Ocultar o no demostrar hasta validar** |
|---|---|---|---|
| **Salud general › Calendario de vacunación** | Estructura, botones de etapas, aviso del PDF, fuentes. Etapas **Recién nacidos**, **Hasta 2 años** y **65 años o más** (sus datos coinciden con el PDF). | **Hasta un año** (el PDF agrega límites de edad del rotavirus, notas D y E: #3). | **Embarazo** (5.1.2; #4, #5, #6), **5 años** (#2: el PDF amplía la cohorte), **11 años** (#7), **15 a 64 años** (5.1.1; #1, #10, #13: faltan hepatitis B, personal de salud y fiebre amarilla). Decir: «el calendario completo está en el PDF oficial». |
| **Salud sexual y ESI › Anticoncepción y prevención** | Encabezado, recuadro de acceso y costo (7.7: frase del Gobierno de la Ciudad), lista de métodos **cerrada** (solo los títulos), Pruebas de VIH y sífilis, «Dónde consultar». | Preservativos (peneano): contenido del Ministerio; avisar que está en revisión. | **Anticoncepción hormonal de emergencia (AHE)** (1.1, 1.2), **«Si se rompió, se corrió o no lo usaste» y PEP** (2.1, 2.2), **«¿Qué es el preservativo vaginal?»** (3.1 a 3.5; el 3.6 se mantiene tal cual), **DIU** (4.1), **Ligadura tubaria y Vasectomía** (4.5: resumen de leyes). |
| **Salud sexual y ESI › Dónde buscar atención** | Todo (las páginas externas están plegadas). | — | — |
| **Salud sexual y ESI › Derechos y ESI** | No demostrar. | — | **Ley 27.610** (7.6; ya estaba en revisión antes de esta ronda). |
| **Salud animal › Si muere tu perro o gato** | Servicio gratuito de Pasteur y «lo que la página oficial no dice». | Horarios y condiciones se confirman con el Instituto (6.4). | **«Primero: ¿mordió a alguien?»** (6.1, 6.2, 6.3: afirmaciones de rabia). |
| **Salud animal › Servicios, Cuidado y Atención gratuita** | Todo. | — | — |
| **Más recursos › Tus derechos** | Tarjetas de salud mental y de salud sexual (ya publicadas antes). | — | Tarjetas **Atención en el sistema público** (7.1, 7.2: Ley 153) y **Vacunas** (5.2.2: Ley 27.491). |
| **Más recursos › Trámites** | Cómo pedir turno en un CeSAC, Vacunarte (5.2.1), «Si te rechazan la atención». | — | — |
| **Más recursos › Preguntas frecuentes** | 6 de las 8 preguntas. | «¿Qué es el preservativo vaginal?» (3.1) y «¿Tengo que pagar los métodos anticonceptivos?» (7.7): avisar que están en revisión. | **«¿Me pueden atender en la Ciudad si no vivo en la Ciudad?»** (7.1). |
| **Más recursos › Glosario** | Todo; cada término cita su fuente. | Tres términos repiten la Ley 153 (Atención primaria, Gratuidad de las acciones de salud, Consentimiento informado): están en revisión legal. | — |
| **Mapa: estados vacíos** | Salud mental, Salud sexual, Odontología. | Decir que el mapa solo muestra prestaciones con gratuidad documentada. | **Guardia oftalmológica**: el texto de urgencia es propio (9.1). No demostrar ese estado hasta revisarlo. |
| **Primeros auxilios › Posibles fracturas y Golpes y caídas** | Las demás guías. | — | Esas dos guías (criterio «caminar sin ayuda»; pendiente desde antes). |

## Qué cambiaría en el código si se elige la opción 2 (propuesta; no hecha)

1. Rama nueva `demo/safe-2026-10-14` derivada de esta.
2. Quitar en ESI › Anticoncepción los bloques AHE, DIU, ligadura y vasectomía y el bloque «preservativo vaginal» (o plegarlos detrás de un aviso «en revisión»).
3. Quitar en Salud animal › Si muere tu perro o gato el recuadro «Primero: ¿mordió a alguien?».
4. Quitar en Más recursos las tarjetas Ley 153 y Vacunas y la pregunta sobre no residentes.
5. Quitar en Salud general las etapas Embarazo, 5 años, 11 años y 15 a 64 años (o dejarlas con un aviso).
6. Dejar en `emptyGuides.ts`, para oftalmología, solo el encabezado «Hoy no tenemos una guardia oftalmológica con gratuidad documentada», sin el texto de urgencia.
7. Actualizar las pruebas que verifican esos textos.

Son entre una y dos horas de trabajo y se revierte con `git revert`. Decisión pendiente.
