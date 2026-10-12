/**
 * Atención veterinaria · Recursos importantes · Cremación gratuita. (It was the section "Si muere tu perro o gato"; it is now a block of the section
 * "Recursos importantes".) Explained from three official pages of the Gobierno de la Ciudad about the Instituto de Zoonosis Luis Pasteur (texts in
 * docs/investigacion/evidencia/pasteur-servicios-cadaveres.txt). What it says:
 *  - the sanitary risk only exists if the animal bit a person within the 10 days before it died (the page says it that way)
 *  - the Instituto receives dead dogs and cats every day, 24 hours, "sin costo, para su disposición final o cremación"
 *  - whoever asks for it must be of age and bring their DNI
 * What it does NOT say, on purpose: individual cremation, ashes returned, any schedule of the vacunatorio (two official pages
 * disagree), the sector or door to enter (only an older version of the page names them), or any private service. The title says what the
 * page offers for free ("cremación"), and the limits are said right below it.
 */
export const CremationBlock = () => (
  <section aria-labelledby="an-cremation" className="flex flex-col gap-4">
    <div>
      <h3 id="an-cremation" className="m-0 text-xl font-extrabold">
        Cremación gratuita
      </h3>
      <p className="m-0 mt-1">Perder a un perro o a un gato es difícil. Acá te contamos qué dice el Gobierno de la Ciudad sobre qué hacer, y qué servicio gratuito existe en la Ciudad de Buenos Aires.</p>
    </div>

    <div className="rounded-2xl border-2 border-control-line bg-field p-4">
      <h4 className="m-0 text-lg font-extrabold">Primero: ¿mordió a alguien?</h4>
      <ul className="m-0 mt-2 flex list-disc flex-col gap-2 pl-5">
        <li>Desde el punto de vista sanitario, solo existe riesgo si el animal mordió a una persona dentro de los 10 días previos a su fallecimiento. Es el período en el que el virus de la rabia, si estuviera presente, puede encontrarse en la saliva.</li>
        <li>Si mordió dentro de ese lapso, el animal debe ser derivado al Instituto de Zoonosis Luis Pasteur para hacer el estudio y descartar rabia.</li>
        <li>Si no mordió, o si la mordedura ocurrió más de 10 días antes del fallecimiento, no existe riesgo sanitario.</li>
      </ul>
    </div>

    <div>
      <h4 className="m-0 text-lg font-extrabold">Un servicio gratuito en la Ciudad de Buenos Aires</h4>
      <p className="m-0 mt-1">
        El Instituto de Zoonosis Luis Pasteur recibe perros y gatos fallecidos todos los días, las 24 horas, sin costo, para su disposición final o cremación, y evalúa cada caso según criterios sanitarios. Su página de
        servicios lo incluye entre los servicios que brinda a la comunidad en forma gratuita.
      </p>
      <ul className="m-0 mt-3 flex list-disc flex-col gap-2 pl-5">
        <li>
          <b>Quién:</b> quien lo solicita tiene que ser mayor de edad y concurrir con DNI.
        </li>
        <li>
          <b>Dónde:</b> el Instituto está en la Av. Díaz Vélez 4821, en la Ciudad de Buenos Aires.
        </li>
        <li>
          <b>Antes de ir:</b> el conmutador del Instituto es 4958-9900, de lunes a viernes de 10 a 17 h, según su página de servicios.
        </li>
      </ul>
    </div>

    <div>
      <h4 className="m-0 text-lg font-extrabold">Lo que la página oficial no dice</h4>
      <ul className="m-0 mt-2 flex list-disc flex-col gap-2 pl-5">
        <li>
          Habla de «disposición final o cremación». <b>No informa</b> si la cremación es individual ni si se entregan las cenizas: no lo damos por hecho. Si es importante para vos, preguntalo al llamar al Instituto.
        </li>
        <li>Es un servicio de la Ciudad de Buenos Aires. Si vivís en otro lugar, consultá en tu municipalidad o en el centro de zoonosis de tu zona qué servicio existe y cuánto cuesta.</li>
        <li>El Instituto no tiene guardia de atención médica ni urgencias. No hacemos recomendaciones de servicios privados.</li>
      </ul>
    </div>

    <p className="m-0 text-sm text-ink-soft">Datos de las páginas oficiales del Instituto, consultadas el 9 de octubre de 2026. No traen fecha de publicación: confirmá con el Instituto antes de ir. AuxiliAR no los verificó en el lugar.</p>
  </section>
)
