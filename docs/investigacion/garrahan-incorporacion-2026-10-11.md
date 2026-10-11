# Hospital Garrahan en el mapa: investigación y alta (11/10/2026)

**Estado:** cargado en `places/ar-c.json` (id `hospital-de-pediatria-dr-j-garrahan`) con **una prestación**: «Consulta pediátrica de alta complejidad», gratuita según las páginas del propio Hospital. Verificación **documental**, con revisión en 30 días (10/11/2026). Nada se confirmó por teléfono ni en el lugar.

## Por qué no estaba
Venía del dataset «Hospitales» de la Ciudad como candidato (tier T1), pero el pipeline lo frenaba: tipo «Hospital de Niños» no aprobado y ninguna prestación aprobada (el dataset no dice qué atiende ni su costo). La regla del mapa exige gratuidad documentada por una fuente oficial para la prestación.

## Qué dicen las páginas oficiales (texto original en `evidencia/garrahan-*.txt`, leídas el 11/10/2026)
- **Costo** (consultas frecuentes): «Sí, el Hospital Garrahan es público y no realiza ningún tipo de cobro por la atención. Si contás con obra social te van a solicitar que la presentes para la cobertura de la prestación médica.» (convivencia hospitalaria): «La atención es y siempre será gratuita para todos los niños y adolescentes.» Medicamentos y descartables los entrega el Hospital, salvo un pedido expreso a la familia para gestionarlos por su cobertura.
- **Quién:** niñas, niños y adolescentes de 0 a 15 años.
- **Cómo:** turno por formulario web; para una consulta nueva, derivación del pediatra, centro de salud u hospital (la hace un profesional médico; un familiar no puede pedirla), con resumen de historia clínica y estudios.
- **Horario:** «Servicios asistenciales: de lunes a viernes de 8 a 16 hs.»; «Emergencias: 24 hs. los 365 días del año».
- **Entrada de pacientes y familias:** Pichincha 1890 (el acceso por Combate de los Pozos es del personal).
- **Ubicación:** dirección y punto del dataset de la Ciudad (Combate de los Pozos 1881; reproyección EPSG:9498 → WGS84), controlado contra USIG: a unos 104 m (el complejo ocupa unos 113 mil m²). Aproximada.

## Qué NO se cargó, y por qué
- **Guardia (Emergencias):** la página de horarios dice 24 h, pero las consultas frecuentes piden ir primero al centro de salud con guardia más cercano, que pide la derivación. No se presenta como guardia gratuita del mapa.
- **Centro de Vacunación** (lunes a viernes de 8 a 15 h, entrada por Av. Brasil 2290): las páginas no dicen a quién atiende.
- **Laboratorio e imágenes:** turnos por correo con pedido médico; no se verificó su gratuidad por separado.
- **Teléfonos del dataset (4941-8772, 4942-7475, guardia 4941-8702):** la página del Hospital no los confirma. Se cargaron los de Informes (4122-6002 y WhatsApp 11 6397-9781).

## Contradicciones y pendientes
- Horario de Informes: 8 a 16 h (consultas frecuentes) vs 6 a 16 h (página de Informes). No se eligió una.
- Para validar con una persona: que la frase de gratuidad del Hospital alcanza a la consulta externa con turno (la fuente habla de «la atención» en general) y que la guardia no deba figurar.
- Las frases de los datos evitan juntar «clínica» + «médica» o «medicamentos»: el buscador del mapa las agrupa por raíz y haría que el Garrahan respondiera a «clínica médica» o «farmacia», que no ofrece como prestación del mapa.

## Cómo se cargó
Registro manual (como el Centro Fijo Costanera Sur) + decisión `link` en `curation/decisions/ar-c.decisions.json`. Sin decisiones `apply`: el pipeline pisaría la fecha y la nota de las coordenadas con las del lote CABA 2. `resources:sync`, `resources:check` y `curation:check` pasan.
