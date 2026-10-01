import { useState } from "react"
import { sendChat, type ChatTurn } from "@/api/chat"
import { EMERGENCY_NUMBERS } from "@/data/emergency"
import { loadProfile, saveProfile } from "@/utils/profileStorage"
import {
  CONNECTION_ERROR_REPLY,
  EMERGENCY_LABELS,
  EMERGENCY_QUESTION,
  EMERGENCY_REPLY,
  LOCAL_REPLY_DELAY_MS,
  NO_EMERGENCY_REPLIES,
  WELCOME_MESSAGES,
  WORKING_MESSAGES,
} from "./ChatConversation.constants"
import type { Message, MessageDraft } from "./ChatConversation.types"

/** Fallback when Auxi says it's an emergency but picks no number: the two that work everywhere */
const BASIC_EMERGENCY_NUMBERS = EMERGENCY_NUMBERS.filter(({ number }) => number === "107" || number === "911")

let lastId = 0
const withId = (draft: MessageDraft): Message => ({ ...draft, id: ++lastId })

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** One message of the list at random, never the same as the previous one */
const pickRandom = (messages: string[], previous: string | null = null) => {
  const options = messages.filter((message) => message !== previous)
  return options[Math.floor(Math.random() * options.length)]
}

/**
 * Conversation with Auxi. It opens asking whether it's an emergency: the Sí / No buttons answer locally,
 * anything written goes to the backend, where the model decides (also whether it's an emergency).
 */
export const useChatConversation = () => {
  const [messages, setMessages] = useState<Message[]>(() => WELCOME_MESSAGES.map(withId))
  // What the model sees: starts with Auxi's welcome, so it knows it asked about an emergency
  const [history, setHistory] = useState<ChatTurn[]>(() =>
    WELCOME_MESSAGES.map(({ text }) => ({ role: "assistant", text })),
  )
  const [typing, setTyping] = useState(false)
  // The Sí / No buttons stay until something is said
  const [askingEmergency, setAskingEmergency] = useState(true)
  // Pressed "Sí": the backend treats everything as an emergency
  const [emergencyButton, setEmergencyButton] = useState(false)
  // Numbers already shown as call buttons in this conversation: they aren't repeated
  const [shownNumbers, setShownNumbers] = useState<string[]>([])
  // Province, locality and age gathered by Auxi; kept on the device (also for Mi Salud) and across new chats
  const [profile, setProfile] = useState(loadProfile)
  // Auxi's last answer asked where they are: the text field suggests localities with their province
  const [asksLocation, setAsksLocation] = useState(false)
  const [lastWorkingMessage, setLastWorkingMessage] = useState<string | null>(null)

  const add = (draft: MessageDraft) => setMessages((current) => [...current, withId(draft)])

  /** Runs one turn with the "typing" dots on, and Sí / No hidden from then on */
  const turn = async (userText: string, run: () => Promise<void>) => {
    setAskingEmergency(false)
    add({ from: "user", text: userText })
    setTyping(true)
    try {
      await run()
    } finally {
      setTyping(false)
    }
  }

  /** The buttons answer right away, without the model; the exchange still goes into its history */
  const answerEmergency = (isEmergency: boolean) => {
    const label = isEmergency ? EMERGENCY_LABELS.yes : EMERGENCY_LABELS.no
    return turn(label, async () => {
      await wait(LOCAL_REPLY_DELAY_MS)
      if (!isEmergency) {
        const reply = pickRandom(NO_EMERGENCY_REPLIES)
        add({ from: "auxi", text: reply })
        setHistory((current) => [...current, { role: "user", text: label }, { role: "assistant", text: reply }])
        return
      }
      setEmergencyButton(true)
      setShownNumbers(EMERGENCY_NUMBERS.map(({ number }) => number))
      add({ from: "auxi", text: EMERGENCY_REPLY, phones: EMERGENCY_NUMBERS })
      await wait(LOCAL_REPLY_DELAY_MS)
      add({ from: "auxi", text: EMERGENCY_QUESTION })
      setHistory((current) => [
        ...current,
        { role: "user", text: label },
        { role: "assistant", text: `${EMERGENCY_REPLY} ${EMERGENCY_QUESTION}` },
      ])
    })
  }

  /**
   * Anything written goes to Auxi: a "working on it" message shows right away, then the answer, which may come
   * as several messages; if Auxi decides it's an emergency, the numbers to call show with the first one.
   */
  const write = (text: string) => {
    if (typing) return
    return turn(text, async () => {
      // Kept out of the model's history: it's just a courtesy
      const working = pickRandom(WORKING_MESSAGES, lastWorkingMessage)
      setLastWorkingMessage(working)
      add({ from: "auxi", text: working })
      const question: ChatTurn = { role: "user", text }
      try {
        const reply = await sendChat([...history, question], emergencyButton, profile)
        const { replies, links, emergency, phones } = reply
        setProfile(reply.profile)
        saveProfile(reply.profile)
        setAsksLocation(reply.asksLocation)
        setHistory((current) => [...current, question, { role: "assistant", text: replies.join("\n\n") }])
        // The numbers for this situation (Auxi's, or ambulance and 911 in an emergency without any), not shown before
        const picked = phones.length > 0 ? phones : emergency ? BASIC_EMERGENCY_NUMBERS : []
        const calls = picked.filter(({ number }) => !shownNumbers.includes(number))
        setShownNumbers((current) => [...current, ...calls.map(({ number }) => number)])
        // One bubble after another, with the "typing" dots in between: the numbers to call
        // under the first one (it's the one telling to call), the suggested pages under the last one
        for (const [index, text] of replies.entries()) {
          if (index > 0) await wait(LOCAL_REPLY_DELAY_MS)
          const last = index === replies.length - 1
          add({ from: "auxi", text, phones: index === 0 ? calls : undefined, links: last ? links : undefined })
        }
      } catch {
        add({ from: "auxi", text: CONNECTION_ERROR_REPLY })
      }
    })
  }

  return { messages, typing, askingEmergency: askingEmergency && !typing, asksLocation, answerEmergency, write }
}
