import { useState } from "react"
import type { ChatTurn } from "@/api/chat"
import { sendProfileAnswer, type ProfileAnswerReply } from "@/api/profileAnswer"
import { healthProfilesStore } from "@/stores/healthProfilesStore"
import type { ProfileTask } from "@/stores/helpChatStore"
import type { HealthProfile, ProfileFieldKey } from "@/types/myHealth"
import { withField, withPlace } from "@/utils/healthProfile"
import { wait } from "@/utils/wait"
import { LOCAL_REPLY_DELAY_MS, type Message, type MessageDraft } from "../ChatConversation"
import { CLOSING, CONNECTION_ERROR_REPLY, GREETING, intro, QUESTIONS } from "./ProfileConversation.constants"

let lastId = 0
const withId = (draft: MessageDraft): Message => ({ ...draft, id: ++lastId })

const profileById = (id: string) => healthProfilesStore.getSnapshot().find((profile) => profile.id === id)

const question = (profile: HealthProfile | undefined, field: ProfileFieldKey) =>
  QUESTIONS[field]({ own: profile?.own ?? false, name: profile?.name ?? "" })

/** Saves what Auxi got out of the answer; false when there was nothing to save */
const save = (profileId: string, field: ProfileFieldKey, { value, locality, province }: ProfileAnswerReply) => {
  if (field === "location") {
    if (!locality) return false
    healthProfilesStore.update(profileId, (profile) => withPlace(profile, { locality, province: province ?? undefined }))
    return true
  }
  if (!value) return false
  healthProfilesStore.update(profileId, (profile) => withField(profile, field, value))
  return true
}

/**
 * Completing a Mi Salud profile with Auxi: it greets, then asks for each piece of data in turn. The model reads
 * every answer (the data, "I'd rather not say", or something to ask again); what it gets is saved right away.
 */
export const useProfileConversation = ({ profileId, fields, update }: ProfileTask) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const profile = profileById(profileId)
    return [GREETING, intro({ own: profile?.own ?? false, name: profile?.name ?? "" }, update), question(profile, fields[0])].map((text) =>
      withId({ from: "auxi", text }),
    )
  })
  const [step, setStep] = useState(0)
  // What the model sees: the exchange about the current piece of data only
  const [exchange, setExchange] = useState<ChatTurn[]>(() => [{ role: "assistant", text: question(profileById(profileId), fields[0]) }])
  const [typing, setTyping] = useState(false)
  // Waiting for the model: the only time the "typing" dots show
  const [thinking, setThinking] = useState(false)
  const [savedAny, setSavedAny] = useState(false)
  const [done, setDone] = useState(false)

  const add = (text: string, from: Message["from"] = "auxi") => setMessages((current) => [...current, withId({ from, text })])

  const next = async (saved: boolean) => {
    await wait(LOCAL_REPLY_DELAY_MS)
    if (step + 1 < fields.length) {
      const text = question(profileById(profileId), fields[step + 1])
      add(text)
      setExchange([{ role: "assistant", text }])
      setStep(step + 1)
      return
    }
    add(saved || savedAny ? CLOSING.saved : update ? CLOSING.unchanged : CLOSING.nothing)
    setDone(true)
  }

  const write = async (text: string) => {
    if (typing || done) return
    add(text, "user")
    setTyping(true)
    const turns: ChatTurn[] = [...exchange, { role: "user", text }]
    setThinking(true)
    try {
      const reply = await sendProfileAnswer(fields[step], turns)
      setThinking(false)
      add(reply.reply)
      const saved = save(profileId, fields[step], reply)
      if (saved) setSavedAny(true)
      if (saved || reply.skipped) await next(saved)
      else setExchange([...turns, { role: "assistant", text: reply.reply }])
    } catch {
      setThinking(false)
      add(CONNECTION_ERROR_REPLY)
    } finally {
      setTyping(false)
    }
  }

  return { messages, typing, thinking, done, field: fields[step], write }
}
