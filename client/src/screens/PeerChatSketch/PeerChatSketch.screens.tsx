import { BadgeCheck, Clock, EllipsisVertical, Flag, Frown, HandHeart, Lock, LogOut, MapPin, Meh, Phone as PhoneIcon, ShieldCheck, Smile, Sparkles, X } from "lucide-react"
import { Auxi } from "@/components/help/Auxi"
import { AuxiBubble, Bubble, Chip, FakeButton, FakeInput, Phone, PhoneTitle, SystemNote } from "./PeerChatSketch.parts"

// ---------- Person who needs help ----------

/** Auxi offers to bring in a person, without dropping the bot */
export const AuxiOffers = () => (
  <Phone header={<PhoneTitle>Chat con Auxi</PhoneTitle>} footer={<FakeInput placeholder="Escribí tu mensaje…" />}>
    <Bubble from="me">Estoy muy angustiada con todo, no sé con quién hablar</Bubble>
    <AuxiBubble>Gracias por contármelo. Te escucho. ¿Querés que te conecte con una persona voluntaria para charlar? Yo sigo acá igual.</AuxiBubble>
    <div className="flex flex-col gap-2 pl-10">
      <FakeButton>
        <HandHeart aria-hidden="true" className="size-4.5" />
        Sí, quiero hablar con alguien
      </FakeButton>
      <FakeButton variant="outline">Seguir con Auxi</FakeButton>
    </div>
    <p className="m-0 mt-auto rounded-xl border border-alert-card-line bg-alert-soft p-2 text-xs font-bold text-alert-text">
      Si estás en peligro ahora, llamá al 911 o a la línea 135.
    </p>
  </Phone>
)

/** Before connecting: topic, what to expect, privacy */
export const BeforeConnecting = () => (
  <Phone header={<PhoneTitle back>Hablar con una persona</PhoneTitle>} footer={<FakeButton>Buscar a alguien</FakeButton>}>
    <p className="m-0 font-extrabold">¿De qué querés hablar?</p>
    <div className="flex flex-wrap gap-2">
      <Chip selected>Salud mental</Chip>
      <Chip>Salud física</Chip>
      <Chip>ESI</Chip>
      <Chip>Otra cosa</Chip>
    </div>
    <ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm">
      <li className="flex gap-2">
        <Lock aria-hidden="true" className="size-4.5 flex-none text-brand" />
        No mostramos tu nombre. Elegís cómo te llaman.
      </li>
      <li className="flex gap-2">
        <BadgeCheck aria-hidden="true" className="size-4.5 flex-none text-brand" />
        Las personas voluntarias están capacitadas, pero no son médicas.
      </li>
      <li className="flex gap-2">
        <ShieldCheck aria-hidden="true" className="size-4.5 flex-none text-brand" />
        Podés terminar o reportar el chat cuando quieras.
      </li>
    </ul>
    <label className="flex flex-col gap-1 text-sm font-bold">
      ¿Cómo querés que te llamen?
      <span className="flex min-h-11 items-center rounded-xl border border-control-line bg-field px-3 font-normal">Luna</span>
    </label>
    <label className="flex items-center gap-2 text-sm">
      <span aria-hidden="true" className="flex size-5 flex-none items-center justify-center rounded border-2 border-brand bg-brand text-xs font-extrabold text-on-brand">✓</span>
      Compartir con la persona voluntaria lo que ya le conté a Auxi
    </label>
  </Phone>
)

/** Waiting for a volunteer, with Auxi keeping company */
export const Waiting = () => (
  <Phone header={<PhoneTitle back>Buscando a alguien</PhoneTitle>} footer={<FakeButton variant="ghost">Cancelar y volver con Auxi</FakeButton>}>
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
      <Auxi className="w-28" />
      <p className="m-0 text-lg font-extrabold">Estoy buscando una persona voluntaria</p>
      <p className="m-0 flex items-center gap-1.5 text-sm text-muted">
        <Clock aria-hidden="true" className="size-4" />
        Tiempo estimado: 2 minutos
      </p>
      <p className="m-0 text-sm text-ink-soft">Hay 3 personas disponibles en Salud mental. Mientras esperás, podés seguir escribiéndome.</p>
    </div>
  </Phone>
)

/** Chat with the volunteer: Auxi joins as a quiet helper */
export const PeerChat = () => (
  <Phone
    header={
      <>
        <span aria-hidden="true" className="flex size-9 flex-none items-center justify-center rounded-full bg-brand-soft font-extrabold text-brand">S</span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="flex items-center gap-1 font-extrabold">
            Sofi
            <BadgeCheck aria-hidden="true" className="size-4 text-brand" />
          </span>
          <span className="text-xs text-muted">Voluntaria · Salud mental</span>
        </span>
        <span className="flex min-h-9 items-center gap-1 rounded-full bg-alert px-2.5 text-xs font-bold text-on-alert">
          <PhoneIcon aria-hidden="true" className="size-3.5" />
          SOS
        </span>
        <EllipsisVertical aria-label="Más opciones" className="size-5 flex-none" />
      </>
    }
    footer={<FakeInput placeholder="Escribile a Sofi…" />}
  >
    <SystemNote>Sofi se unió al chat · Auxi sigue acá</SystemNote>
    <Bubble from="them" initial="S">Hola Luna, soy Sofi. Leí lo que le contaste a Auxi. ¿Cómo te sentís ahora?</Bubble>
    <Bubble from="me">Un poco mejor, gracias por escribir</Bubble>
    <Bubble from="them" initial="S">Me alegra. Contame a tu ritmo, no hay apuro.</Bubble>
    <AuxiBubble>Si les sirve, dejo esto: <span className="font-bold text-brand underline">Ansiedad: qué hacer en el momento</span></AuxiBubble>
  </Phone>
)

/** End of the chat: how it went, report, back to Auxi */
export const ChatEnded = () => (
  <Phone header={<PhoneTitle>Chat terminado</PhoneTitle>} footer={<FakeButton>Volver con Auxi</FakeButton>}>
    <div className="flex flex-col items-center gap-2 text-center">
      <Auxi className="w-24" />
      <p className="m-0 text-lg font-extrabold">¿Cómo te fue con Sofi?</p>
    </div>
    <div className="flex justify-center gap-3">
      {[
        { Icon: Frown, label: "Mal" },
        { Icon: Meh, label: "Más o menos" },
        { Icon: Smile, label: "Bien" },
      ].map(({ Icon, label }) => (
        <span key={label} className={`flex w-20 flex-col items-center gap-1 rounded-2xl border-2 p-2 text-xs font-bold ${label === "Bien" ? "border-brand bg-brand-soft text-brand" : "border-line-strong text-ink-soft"}`}>
          <Icon aria-hidden="true" className="size-8" />
          {label}
        </span>
      ))}
    </div>
    <span className="flex min-h-11 items-center rounded-xl border border-control-line bg-field px-3 text-sm text-muted">¿Querés dejarle un mensaje? (opcional)</span>
    <p className="m-0 flex items-center justify-center gap-1.5 text-sm font-bold text-alert-text">
      <Flag aria-hidden="true" className="size-4" />
      Reportar algo de este chat
    </p>
  </Phone>
)

// ---------- Person who wants to help ----------

/** Sign up as a volunteer */
export const VolunteerSignUp = () => (
  <Phone header={<PhoneTitle back>Quiero ayudar</PhoneTitle>} footer={<FakeButton>Enviar solicitud</FakeButton>}>
    <div className="flex items-center gap-3 rounded-2xl bg-brand-soft p-3">
      <Auxi className="w-14 flex-none" />
      <p className="m-0 text-sm">¡Gracias por sumarte! Antes de chatear, hacés una capacitación corta.</p>
    </div>
    <p className="m-0 font-extrabold">¿En qué temas podés ayudar?</p>
    <div className="flex flex-wrap gap-2">
      <Chip selected>Salud mental</Chip>
      <Chip selected>ESI</Chip>
      <Chip>Salud física</Chip>
      <Chip>Animales</Chip>
    </div>
    <p className="m-0 font-extrabold">Pasos</p>
    <ol className="m-0 flex list-none flex-col gap-2 p-0 text-sm">
      {[
        { label: "Crear tu cuenta", done: true },
        { label: "Curso de escucha (20 min)", done: true },
        { label: "Aceptar el código de convivencia", done: false },
        { label: "Revisión del equipo de AuxiliAR", done: false },
      ].map(({ label, done }, index) => (
        <li key={label} className="flex items-center gap-2">
          <span aria-hidden="true" className={`flex size-6 flex-none items-center justify-center rounded-full text-xs font-extrabold ${done ? "bg-brand text-on-brand" : "border-2 border-line-strong text-ink-soft"}`}>
            {done ? "✓" : index + 1}
          </span>
          <span className={done ? "text-muted line-through" : ""}>{label}</span>
          <span className="sr-only">{done ? "(hecho)" : "(pendiente)"}</span>
        </li>
      ))}
    </ol>
  </Phone>
)

/** Volunteer's home: availability and people waiting */
export const VolunteerQueue = () => (
  <Phone header={<PhoneTitle>Panel de ayuda</PhoneTitle>}>
    <div className="flex items-center justify-between gap-2 rounded-2xl border border-line-strong p-3">
      <span className="flex flex-col">
        <span className="font-extrabold">Estoy disponible</span>
        <span className="text-xs text-muted">Te avisamos cuando alguien te necesite</span>
      </span>
      <span aria-hidden="true" className="flex h-7 w-12 flex-none items-center justify-end rounded-full bg-brand p-1">
        <span className="size-5 rounded-full bg-on-brand" />
      </span>
    </div>
    <p className="m-0 font-extrabold">Esperando ayuda (2)</p>
    {[
      { who: "Luna, 16 años", topic: "Salud mental", place: "Córdoba", wait: "hace 2 min" },
      { who: "Anónimo", topic: "ESI", place: "Salta", wait: "hace 5 min" },
    ].map(({ who, topic, place, wait }) => (
      <div key={who} className="flex flex-col gap-2 rounded-2xl border border-line-strong bg-surface-alt p-3">
        <div className="flex items-start justify-between gap-2">
          <span className="font-bold">{who}</span>
          <span className="text-xs text-muted">{wait}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Chip>{topic}</Chip>
          <span className="flex items-center gap-1 text-muted">
            <MapPin aria-hidden="true" className="size-3.5" />
            {place}
          </span>
        </div>
        <FakeButton>Aceptar chat</FakeButton>
      </div>
    ))}
  </Phone>
)

/** The same chat seen by the volunteer: Auxi's summary and tools */
export const VolunteerChat = () => (
  <Phone
    header={
      <>
        <span aria-hidden="true" className="flex size-9 flex-none items-center justify-center rounded-full bg-brand-soft font-extrabold text-brand">L</span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="font-extrabold">Luna</span>
          <span className="text-xs text-muted">16 años · Córdoba</span>
        </span>
        <LogOut aria-label="Terminar chat" className="size-5 flex-none" />
      </>
    }
    footer={
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <span className="flex min-h-9 flex-1 items-center justify-center gap-1 rounded-full bg-field px-2 text-xs font-bold">
            <Sparkles aria-hidden="true" className="size-3.5 text-brand" />
            Pedir ayuda a Auxi
          </span>
          <span className="flex min-h-9 flex-1 items-center justify-center gap-1 rounded-full bg-alert px-2 text-xs font-bold text-on-alert">
            <PhoneIcon aria-hidden="true" className="size-3.5" />
            Es una emergencia
          </span>
        </div>
        <FakeInput placeholder="Escribile a Luna…" />
      </div>
    }
  >
    <div className="rounded-2xl border border-line-strong bg-brand-soft p-3 text-sm">
      <p className="m-0 flex items-center gap-1.5 font-extrabold">
        <Auxi className="w-6" />
        Resumen de Auxi
        <X aria-hidden="true" className="ml-auto size-4" />
      </p>
      <p className="m-0 mt-1">Se siente angustiada por la escuela y su casa. No hay señales de riesgo inmediato. Luna aceptó compartir esto.</p>
    </div>
    <Bubble from="me">Hola Luna, soy Sofi. Leí lo que le contaste a Auxi. ¿Cómo te sentís ahora?</Bubble>
    <Bubble from="them" initial="L">Un poco mejor, gracias por escribir</Bubble>
  </Phone>
)
