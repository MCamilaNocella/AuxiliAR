# Material preparado y NO publicado (ronda de contenido, 9/10/2026)

Nada de lo de este documento está en el sitio, en el mapa ni en los datos. Cada propuesta indica qué falta para publicarla.

## 1. Videos integrados (RCP, DEA, atragantamiento): propuesta de integración visual

Candidatos, fuentes, duración, idioma, fecha y limitaciones: ver [§4.3 de la auditoría](../auditoria-contenido/informe-auditoria-contenido.md). Resumen:

| Guía | Candidato | Estado |
|---|---|---|
| RCP | «¿Cómo realizar la maniobra de RCP?», Ministerio de Salud de la Nación (`wbp_AdGkWPM`, 2:14, 21/8/2023) | Mejor candidato. Revisar vigencia contra la guía aprobada (Mini Guía de RCP 2025). Subtítulos solo automáticos. |
| RCP + DEA | UNAHUR, Centro de Simulación Clínica (`XsJeJMUhKYU`, 3:12, 2024) | Segundo candidato (universidad pública). |
| Atragantamiento | Sin video del Ministerio. Solo Cruz Roja de España, una fundación de Colombia y educ.ar (2013) | No publicar sin permiso o producción propia. |

**Cómo se vería dentro de la guía** (propuesta; no hay código en el sitio):

```
┌ Guía: RCP · no respira ─────────────────────────────┐
│ [Los pasos en texto, como hoy]                       │
│                                                      │
│ ▶ Ver el video (2 min)  ← botón; el video NO se      │
│   carga hasta que la persona lo toca                 │
│ ┌──────────────────────────────────────────────┐    │
│ │ miniatura propia + «Ministerio de Salud, 2023»│    │
│ └──────────────────────────────────────────────┘    │
│ ▸ Leer la transcripción (texto, mismos pasos)        │
│ Fuente: Ministerio de Salud de la Nación (se abre    │
│ en YouTube, pestaña nueva)                           │
└──────────────────────────────────────────────────────┘
```

- Reproductor en `youtube-nocookie.com`, sin reproducción automática, con título accesible y carga recién al tocar («fachada»): no se envía nada a YouTube mientras la persona no lo pide.
- Los pasos escritos son siempre la información principal; el video es un complemento. Si el video no carga, la guía se entiende igual.
- Debajo: institución, fecha del video, duración y enlace a la fuente.
- En una emergencia real la guía no debe depender del video: va **después** de los pasos y del botón de llamar.

**Falta para publicar:** (1) revisión clínica de una persona profesional (no pudimos ver ni oír los videos); (2) confirmación escrita del Ministerio o de la UNAHUR sobre el uso incrustado; (3) decisión sobre atragantamiento (permiso a Cruz Roja Argentina o al Ministerio, o producción propia); (4) autorización de quien mantiene las guías de Primeros auxilios.

## 2. Audios de la OMS y videos propios de relajación (Salud mental › Herramientas para cuidarte)

- Fuente: OMS, «En tiempos de estrés, haz lo que importa» (ejercicios de audio) y su versión para América Latina de la OPS. Licencia CC BY-NC-SA 3.0 IGO.
- Integración propuesta: un bloque «Ejercicios para calmarte» con reproductor de audio nativo (`<audio controls>`), título, duración, transcripción en texto y la frase «estas técnicas no reemplazan la atención profesional». Los audios se alojarían en el sitio solo si la licencia lo permite; si no, se enlazan como fuente.
- **Falta:** lectura legal de «uso no comercial» (¿aplica a AuxiliAR?), revisión profesional del texto en español, decisión entre audios de la OMS o producción propia con profesionales de psicología del equipo.

## 3. Nueva prestación del mapa: Instituto Pasteur (disposición de perros y gatos fallecidos)

No se agregó al mapa. Modelado propuesto:

- **Lugar:** Instituto de Zoonosis Luis Pasteur, Av. Díaz Vélez 4821, CABA (`facilityType: zoonosis-center`). **No está en el dataset hoy.** Falta verificar la ubicación del punto contra una fuente cartográfica (método ya usado para los CeSAC).
- **Prestaciones con gratuidad documentada** (fuente: página «Servicios», «brinda a la comunidad, en forma gratuita»):
  - `zoonosis` (consultorio clínico; turnos presenciales; sin urgencias),
  - `rabies-vaccination` (vacunatorio; **sin horario**: las dos páginas oficiales se contradicen),
  - **nueva:** disposición de cadáveres de perros y gatos («sin costo, para su disposición final o cremación»; mayor de edad con DNI). **No existe un tipo de servicio para esto**: hay que crear uno (por ejemplo `animal-remains-disposal`) en `taxonomy.json`, con su categoría `animales`, y agregarlo al filtro «Salud animal». Es un cambio de modelo de datos: requiere aprobación.
- **Qué NO poner en la ficha:** cremación individual ni cenizas; horarios del vacunatorio.
- La sección interna «Si muere tu perro o gato» ya está publicada en Salud animal y la ficha del mapa debería enlazarla.

## 4. «Consejería y métodos anticonceptivos» para CeSAC 3, 41 y 47

Respaldo documental (todo en `docs/investigacion/evidencia`):

| Dato | Fuente |
|---|---|
| Los tres CeSAC figuran en la lista oficial de consejerías en salud sexual: «En los siguientes centros de salud y hospitales se puede acceder a los métodos anticonceptivos y a la interrupción del embarazo» (CeSAC 3: Av. Soldado de la Frontera 5144; CeSAC 41: Ministro Brin 843; CeSAC 47: Barrio 31). Ligadura y vasectomía: «No» en los tres. | `caba-consejerias-salud-sexual-lista.txt` |
| Gratuidad: «La atención y los métodos son gratuitos en el sistema público» (Gobierno de la Ciudad). | `caba-metodos-anticonceptivos-gratuitos.txt` |

Borrador de la prestación (tipo ya existente `contraception`; **no aplicado**):

```json
{
  "id": "consejeria-metodos-anticonceptivos",
  "type": "contraception",
  "name": "Consejería y métodos anticonceptivos",
  "hours": null,
  "cost": "free",
  "requirements": [],
  "appointment": { "mode": "unknown", "howTo": "Contacto de la consejería según la lista oficial; no confirmamos si hace falta turno." },
  "source": {
    "organization": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
    "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos",
    "retrievedAt": "2026-10-09",
    "note": "«La atención y los métodos son gratuitos en el sistema público». La existencia de la consejería en este centro figura en la lista oficial de consejerías en salud sexual."
  },
  "evidence": [
    { "kind": "cost", "...": "página de métodos anticonceptivos del Gobierno de la Ciudad, 9/10/2026" },
    { "kind": "existence", "...": "lista oficial de consejerías en salud sexual, 9/10/2026" }
  ]
}
```

**Limitación a decidir por el equipo:** la frase de gratuidad es general («en el sistema público»), no menciona cada CeSAC, igual que en el caso de la Ley 153 que ya se aceptó para «Clínica médica». Si el equipo acepta ese criterio, se agrega con un `costNote` «Gratuita con condiciones»-equivalente solo si corresponde. Falta además el teléfono de cada consejería: la lista da 11-2821-3603, -3641 y -3647; **el equipo de datos debe confirmar si se copia o se usa el de la ficha**. No se agregó nada.

## 5. Lo que no se pudo confirmar

- **Preservativos vaginales en el Hospital Rivadavia:** sin fuente oficial. En AuxiliAR **no se afirma**; la sección explica qué es el preservativo vaginal (fuente: Ministerio de Salud) y dice que no hay centros concretos confirmados. Para publicarlo hace falta la fuente original de la afirmación o una llamada al hospital registrada (nombre, fecha y frase).
