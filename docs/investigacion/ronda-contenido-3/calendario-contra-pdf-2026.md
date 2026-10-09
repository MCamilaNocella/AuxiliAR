# Calendario de AuxiliAR contra el PDF oficial del Calendario Nacional de Vacunación 2026

Fecha: 9/10/2026. Rama `demo/content-round3-final`. **No se cambió ninguna recomendación clínica.** Lo único que se agregó a la página (ver §4) es un aviso general y el enlace al PDF.

## 1. Qué se comparó y cómo

- **PDF oficial:** «Calendario Nacional de Vacunación 2026», afiche 70 × 50 cm del 10/3/2026 ([enlace](https://www.argentina.gob.ar/sites/default/files/2026-03-10_calendario_nacional_vacunacion_70x50_web.pdf)), el que enlaza la página `argentina.gob.ar/salud/vacunas`. También su infografía por etapas ([enlace](https://www.argentina.gob.ar/sites/default/files/2026-03-10_infografia_calendario_vacunas_50x70_digital.pdf)).
- **Limitación importante:** el afiche es una tabla gráfica sin texto extraíble. Lo dibujé como imagen y **lo leí a ojo**; la transcripción de la tabla y de las notas está en [calendario-2026-pdf-poster-transcripcion.txt](../evidencia/calendario-2026-pdf-poster-transcripcion.txt). La infografía sí se leyó como texto. **Una persona debe cotejar mi transcripción con el PDF** antes de tomar decisiones clínicas.
- **Lo que AuxiliAR muestra** viene de las 8 páginas HTML por etapa (9/10/2026), no del PDF. Las páginas HTML y el PDF no son idénticos.

## 2. Resultado

**Coinciden** (dosis, edades y esquemas de la tabla) en: recién nacidos, 2, 3, 4, 5, 6, 12 y 15 a 18 meses (neumococo, quíntuple, IPV, rotavirus, meningococo, hepatitis A, triple viral, varicela, antigripal de 6 a 24 meses y fiebre amarilla a los 18 meses); 5 años (IPV, triple viral, triple bacteriana celular, varicela); 11 años (meningococo, triple bacteriana acelular, VPH); 65 años o más (antigripal anual, neumococo, doble bacteriana cada 10 años); y las dosis de embarazo (antigripal, triple bacteriana acelular, VSR).

**Diferencias, omisiones y datos que dependen del año** (el PDF trae más que las páginas HTML que usamos). «Fragmento» = lo que dice hoy AuxiliAR; «PDF» = lo que dice el afiche.

| # | Etapa | Fragmento de AuxiliAR | Lo que dice el PDF | Tipo | Gravedad |
|---|---|---|---|---|---|
| 1 | Todos los de 11 años en adelante | **No aparece la hepatitis B.** Solo figura la dosis neonatal. | Columna Hepatitis B: «iniciar o completar esquema (C)» desde «nacidos en 2015» hasta adultos, embarazadas, puérperas y personal de salud. Nota (C): si hay que iniciar, 1º dosis, 2º al mes y 3º a los seis meses de la primera. | **Omisión** | **Alta** |
| 2 | 5 años | «…a quienes nacieron en 2021.» (triple viral SRP incluida) | Triple viral en esa fila: «Nacidos 2021/22/23/24 (J)»: «2° dosis, en el año en que cumplen 5 años, para quienes nacieron en 2021, 2022, 2023 y en los primeros 6 meses de 2024». | **Dato dependiente del año / diferencia** | **Alta** |
| 3 | Hasta un año | Rotavirus: «primera dosis» (2 meses) y «segunda dosis» (4 meses), sin límite. | Notas (D) y (E): la 1º dosis antes de las 14 semanas y 6 días (o 3 meses y medio) y la 2º antes de las 24 semanas (o 6 meses de vida). | **Omisión** (límite de edad) | **Alta** |
| 4 | Embarazo | «VSR: una dosis en cada embarazo, entre las semanas 32 y 36,6.» | Nota (O): «…durante la temporada de circulación del VSR». | **Omisión** (condición) | Media |
| 5 | Embarazo | «Triple bacteriana acelular: una dosis en cada embarazo, a partir de la semana 20.» | Nota (L): «…independientemente del tiempo transcurrido desde la dosis previa». | Omisión | Baja |
| 6 | Embarazo / puerperio | «…se aplica una dosis dentro de los 10 días posteriores al parto.» | Nota (I): «…antes del egreso de la maternidad y hasta un máximo de diez días después del parto». Además, puérperas: triple viral «iniciar o completar esquema (K)». | Omisión | Media |
| 7 | 11 años | «Fiebre amarilla: refuerzo para quienes residan en zonas de riesgo.» | Nota (Q): «…si la 1° dosis la recibió antes de los 2 años». | **Omisión** (condición) | Media |
| 8 | 11 años | «VPH: una única dosis.» | Nota (N): «Varones y mujeres». | Omisión menor | Baja |
| 9 | 15 a 64 años | «Fiebre Hemorrágica Argentina: … para personas que residan o trabajen en la zona endémica…» | Nota (R): «…que no hayan recibido anteriormente la vacuna». | Omisión | Baja |
| 10 | 15 a 64 años | «Antigripal: dosis anual para quienes presenten alguno de estos factores de riesgo…» (HTML) | El afiche muestra en «adultos»: «dosis anual (G)», con (G): «Recomendada en adultos de 65 años o más». No lista factores de riesgo. | **Presentación distinta** (las dos páginas oficiales no dicen lo mismo; AuxiliAR sigue la HTML) | **Alta** (lo decide una persona clínica) |
| 11 | 15 a 64 años | «Doble o triple viral: toda persona a partir de los 5 años debe acreditar 2 dosis…» | Nota (K): «Si no hubiera recibido dos dosis de triple viral o una dosis de triple viral + 1 de doble viral, después del año de vida para los nacidos después de 1965». | Coinciden en el fondo, redacción distinta | Baja |
| 12 | (no existe en AuxiliAR) | **No hay etapa «Personal de salud».** | Antigripal anual; triple bacteriana acelular una dosis para quien asista menores de 12 meses, revacunar cada 5 años (M); hepatitis B y triple viral a completar. | **Omisión** (grupo entero) | Media |
| 13 | Fiebre amarilla (todas las etapas) | Solo «zonas de riesgo» en 18 meses y 11 años. | Nota (*): «Toda persona entre 2 y 59 años residente en zona de riesgo debe recibir 1 dosis (consultar previamente con el equipo de salud las contraindicaciones)». | **Omisión** | Media |
| 14 | Hasta un año / hasta 2 años | «Meningococo» | El afiche lo nombra «Meningococo ACYW». | Nombre incompleto | Baja |
| 15 | 65 o más | «Neumococo: el esquema es de una dosis de VCN20.» | El afiche: «única dosis (G)», sin nombrar el tipo (VCN20 viene de la página HTML). | Detalle que el PDF no tiene | Baja |

**Datos que dependen del año del calendario** (hay que revisarlos cada año): «nacieron en 2021» (5 años), «nacieron en 2015» (11 años) y la cohorte ampliada de la nota (J).

**Errores de transcripción** en las etapas HTML: no se encontraron (la prueba automática compara 49 líneas con el texto de las páginas HTML; ver `round3:test`).

**Qué sí es seguro decir:** las dosis y edades que AuxiliAR muestra **no contradicen** el PDF; lo que falta son condiciones y grupos. **Una verificación automática no sustituye la revisión clínica** de estos puntos.

## 3. Propuesta (sin aplicar; requiere decisión de una persona con formación clínica)

- **Mínimo para la demo:** mostrar solo las etapas cuyos datos coinciden con el PDF (recién nacidos, hasta un año *con la advertencia del rotavirus*, hasta 2 años, 65 o más) y no demostrar embarazo, 5 años, 11 años ni 15 a 64 años hasta revisarlos. Ver [propuesta-demo-segura.md](propuesta-demo-segura.md).
- **Después de la revisión:** agregar los puntos 1, 2, 3, 4, 7, 10, 12 y 13 con el texto que apruebe quien revise. No lo redacté para no introducir recomendaciones clínicas.

## 4. Lo que sí se cambió en la página (no clínico)

- Se agregó el PDF oficial a «Fuentes oficiales» de la sección.
- Se agregó en «Recordá» el aviso: «Este resumen no reproduce todas las notas del calendario oficial (por ejemplo, límites de edad de algunas dosis, cohortes de nacimiento, personal de salud y esquemas a completar). El PDF oficial las trae completas.»
- Ningún dato de vacunas cambió.
