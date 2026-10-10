import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { Play } from "lucide-react"
import { Disclosure } from "@/components/health/Disclosure"
import { OutLink } from "@/components/health/OutLink"

type VideoEmbedProps = {
  /** The 11-character id of the video on YouTube (never a full address) */
  videoId: string
  /** What the video is, for screen readers and as its caption. Required */
  title: string
  /** Address of the ORIGINAL video, always offered as an alternative way to watch it */
  originalUrl: string
  /** Who publishes the video (an institution), shown under it */
  publisher: string
  /** Day it was published, "YYYY-MM-DD" */
  publishedAt?: string
  /** Length as the original says it, "2:14" */
  duration?: string
  /** Language of the subtitles to ask the player for. Default "es" */
  captionsLang?: string
  /** Whether the original has subtitles that someone checked: changes what the component says about them */
  hasCheckedCaptions?: boolean
  /** The text of the video (what is said and shown). Offered under the video, closed */
  transcript?: ReactNode
}

const YOUTUBE_ID = /^[\w-]{11}$/

const formatDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number)
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)))
}

/**
 * A short video inside the site, from its original source: nothing is downloaded or republished. It is responsive (16:9), loads
 * only when the person asks to play it (a facade, so nothing is sent to the video service before that, and with the
 * no-cookies address), asks the player for subtitles in the language of the page when the original has them, and always offers
 * the original video and the text of it. It is used in no page yet: before putting a health video here, its content, its validity and its
 * permission to be embedded have to be checked (docs/componentes/video-embed.md).
 */
export const VideoEmbed = ({ videoId, title, originalUrl, publisher, publishedAt, duration, captionsLang = "es", hasCheckedCaptions = false, transcript }: VideoEmbedProps) => {
  const [playing, setPlaying] = useState(false)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const validId = YOUTUBE_ID.test(videoId)
  const validOriginal = originalUrl.startsWith("https://")

  // When the player appears, the focus goes to it: the person who pressed "Reproducir" keeps going with the keyboard
  useEffect(() => {
    if (playing) frameRef.current?.focus()
  }, [playing])

  const embed = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1&hl=${captionsLang}&cc_load_policy=1&cc_lang_pref=${captionsLang}`
  const details = [publisher, publishedAt ? formatDate(publishedAt) : null, duration ? `Duración: ${duration}` : null].filter(Boolean).join(" · ")

  return (
    <figure className="m-0 flex flex-col gap-2">
      {validId ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-line-strong bg-aid text-on-aid">
          {playing ? (
            <iframe
              ref={frameRef}
              title={title}
              src={embed}
              loading="lazy"
              allow="encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 size-full border-0"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Reproducir el video: ${title}`}
              className="absolute inset-0 flex size-full cursor-pointer flex-col items-center justify-center gap-3 border-0 bg-transparent p-4 text-center text-on-aid focus-visible:outline-on-aid"
            >
              <span aria-hidden="true" className="flex size-16 items-center justify-center rounded-full bg-on-aid text-aid-ink">
                <Play className="size-8 translate-x-0.5 fill-current" />
              </span>
              <span className="text-lg font-extrabold text-pretty">{title}</span>
              <span className="text-sm">El video se carga cuando lo reproducís.</span>
            </button>
          )}
        </div>
      ) : null}

      <figcaption className="flex flex-col gap-1 text-sm text-ink-soft">
        <span>{title}</span>
        {details ? <span>{details}</span> : null}
        {validId ? (
          <span>{hasCheckedCaptions ? "Tiene subtítulos: se activan solos al reproducirlo." : "Si el video tiene subtítulos, se activan solos. Si no, leé la transcripción."}</span>
        ) : null}
        {validOriginal ? (
          <span>
            <OutLink href={originalUrl}>Ver el video original (se abre en otra página)</OutLink>
          </span>
        ) : null}
      </figcaption>

      {transcript ? <Disclosure title="Leer la transcripción del video" compact>{transcript}</Disclosure> : null}
    </figure>
  )
}
