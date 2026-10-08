# Salud animal · qué se hizo con cada ficha (SA01 a SA14)

Fecha: 8/10/2026. Origen: documento maestro de recursos (8/10/2026). Criterio: `curation/CRITERIO-DE-RECOMENDACION.md`. Rama: `feature/animal-health`.

**No se agregó ningún servicio al mapa, no se creó un segundo mapa, y no se copió ningún teléfono, dirección ni horario.** Las páginas se leyeron con una herramienta que devuelve resúmenes: antes de dar una afirmación por cerrada, hay que cotejarla con la página original.

Cómo se dice cada cosa: lo que una página municipal informa como gratuito se escribe como «la página oficial informa», con el alcance (solo ese municipio) y sin decir que AuxiliAR lo verificó en persona. Lo que la página deja abierto (costo, vigencia) va en «Todavía sin confirmar».

| Ficha | Recurso | Uso | Qué se dice o por qué no |
|---|---|---|---|
| SA01 | Animales BA (CABA) | **Informado como gratuito** (sección 1) | Castración y vacunación antirrábica «totalmente gratuito». Castración con turno online y cuenta miBA; vacuna en operativos sin turno según cronograma; el animal va con un mayor de 18 años. La página muestra la agenda de octubre de 2026 (leída el 8/10/2026) y tiene dos **centros fijos** (Indoamericano y Costanera Sur) para castración; la vacuna antirrábica va en operativos. No informa guardia ni urgencias. **No es una guardia veterinaria general.** |
| SA02 | Vacunación del Instituto Pasteur (CABA) | **Sin confirmar** (sección 1) | Vacuna antirrábica anual desde los 3 meses, sin turno y por orden de llegada, según la página. **La página no informa el costo.** No se copian dirección ni horarios. |
| SA03 | Salud animal de Rosario | **Informado como gratuito** (sección 1) | Esterilización y vacuna antirrábica «gratuita». No informa requisitos de domicilio ni cómo pedir la esterilización, ni si otras vacunas o estudios son gratuitos: se dice así. |
| SA04 | Castraciones de Córdoba Capital | **Informado como gratuito** (sección 1) | Castraciones gratuitas y masivas para vecinos de la ciudad. El turno es por WhatsApp (no se copia el número). **Pendiente:** otras notas de 2025 publican otro canal (0800); confirmar cuál es el vigente. |
| SA05 | Hospital y red de Salta | **Informado como gratuito, con condiciones** (sección 1) | La página informa atención veterinaria, vacunación y castración gratuitas para mayores de 18 con DNI con domicilio en la ciudad; certificado de carencia de recursos para controles; sin internación ni estudios complementarios. **Pendiente:** contradicción de la página sobre las razas braquicéfalas y horarios que se contradicen en una sede (se avisa; no se anuncia guardia). |
| SA06 | Esterilización de Neuquén | **Sin confirmar** (sección 1) | Preturno online y llamada posterior de confirmación, mayores de 18 con residencia, perros desde los seis meses. **La página no deja claro el costo**: no se afirma gratuidad. Un preturno no es una cirugía confirmada. |
| SA07 | Hospital Escuela UBA | **Excluida** (se nombra como arancelado en la sección 3) | Su página dice «Todos los servicios son arancelados». No atiende urgencias sin coordinación previa. Se avisa que ser universidad pública no lo hace gratuito. |
| SA08 | Atención clínica UNLP | **Excluida** (se nombra como arancelado en la sección 3) | Su página (22/3/2024) dice «Los servicios son arancelados». No se copia el teléfono. |
| SA09 | Rabia y accidentes con animales | **Dice** (sección 2), con **revisión clínica pendiente** | Vacunar cada año a perros y gatos desde los 3 meses y durante toda su vida; evitar el contacto con animales silvestres; ante una mordedura, acudir rápido a un centro de salud. **No se incluyen los pasos de lavado ni esquemas de profilaxis**, a pedido de la propia ficha. |
| SA10 | Zoonosis (Senasa) | **Dice** (secciones 1 a 3) | Qué es una zoonosis; Senasa se ocupa de animales de producción; para perros y gatos, deriva al centro de zoonosis local o al Ministerio de Salud. **No se presenta Senasa como clínica gratuita para mascotas.** |
| SA11 | Castraciones comunitarias (Proyecto 4 Patas) | **No publicada** | Organización civil: campañas financiadas por donaciones, sin turno abierto universal ni gratuidad confirmada para cualquier solicitante. Pendiente: cupos, barrios, costo y requisitos. |
| SA12 | Padrón de médicos veterinarios | **No publicada** | Registro de matrículas, no atiende ni garantiza precios. Útil solo para comprobar credenciales; no es un directorio gratuito. |
| SA13 | Hospital veterinario de urgencias de Córdoba | **No publicada** | Es un anuncio de obra («en futuro»): no acredita apertura. No se publica como guardia disponible. Seguimiento: buscar inauguración, admisión y contacto. |
| SA14 | Castraciones de Protenencia (Nación) | **Sin confirmar** (sección 1) | La página describe castraciones gratuitas por orden de llegada en operativos (hasta dos animales, mayores de edad con DNI), pero **no informa fechas, localidades ni si el programa sigue vigente**. Referencia histórica; se prefieren las fichas municipales. |

## Mapa integral: cómo se podría reutilizar (sin cambiar nada hoy)
- El esquema de datos **ya prevé** el tipo de establecimiento `public-veterinary` y el tipo de servicio `veterinary-care`, y el explorador los deja fuera de todos los grupos de filtro (solo aparecen en «Todos»). No hay ninguna entrada veterinaria cargada.
- Para mostrar servicios veterinarios gratuitos en el mapa hay que: cargar cada establecimiento con su fuente y su gratuidad por servicio, y **sumar un filtro rápido** («Salud animal») en la lógica compartida del explorador. Lo segundo toca el mapa de todos y necesita aprobación.
- Las campañas (vacunación en operativos, castraciones por turno) no son un lugar fijo con dirección: se ajustan mal a una ficha de centro. Conviene mantenerlas como información fechada, no como pines.

## Pendiente de verificación (nada se publica sin aprobación)
1. Cotejar con la página original cada afirmación de las seis páginas municipales y la nacional.
2. Canal de turno vigente de Córdoba y que los centros fijos de CABA sigan operando según la agenda.
3. Costo del vacunatorio del Instituto Pasteur y de la esterilización de Neuquén.
4. Contradicciones de Salta (razas, horarios).
5. Vigencia de Protenencia en cada localidad.
6. Revisión veterinaria y clínica del texto de la sección 2 antes de publicar.
7. Ampliar a más municipios y provincias con fuentes propias (el documento sugiere pistas territoriales).
