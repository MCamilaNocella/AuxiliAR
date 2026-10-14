import { useState } from "react"
import { sendChat, type ChatTurn } from "@/api/chat"
import { BASIC_EMERGENCY_NUMBERS, EMERGENCY_NUMBERS } from "@/data/emergency"
import { loadProfile, saveProfile } from "@/utils/profileStorage"
import { wait } from "@/utils/wait"
import {
  BACK_FROM_PERSON_NOTE,
  CONNECTION_ERROR_REPLY,
  EMERGENCY_LABELS,
  EMERGENCY_QUESTION,
  EMERGENCY_REPLY,
  KEEP_WITH_AUXI_REPLY,
  LOCAL_REPLY_DELAY_MS,
  NO_EMERGENCY_REPLIES,
  OFFER_LABELS,
  PERSON_OFFER,
  WELCOME_BACK_REPLY,
  WELCOME_MESSAGES,
} from "./ChatConversation.constants"
import type { Message, MessageDraft } from "./ChatConversation.types"

let lastId = 0
const withId = (draft: MessageDraft): Message => ({ ...draft, id: ++lastId })

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
  // Waiting for the model: the only time the "typing" dots show (local answers don't need thinking)
  const [thinking, setThinking] = useState(false)
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
  // Auxi's last answer offered to talk with a volunteer: the buttons to say yes or no show
  const [offeringPerson, setOfferingPerson] = useState(false)

  const add = (draft: MessageDraft) => setMessages((current) => [...current, withId(draft)])

  /** Runs one turn: sending waits until it's over, and Sí / No are hidden from then on */
  const turn = async (userText: string, run: () => Promise<void>) => {
    setAskingEmergency(false)
    setOfferingPerson(false)
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
   * Anything written goes to Auxi: the typing dots show while it works, then the answer, which may come
   * as two messages; if Auxi decides it's an emergency, the numbers to call show with the first one.
   */
  const write = (text: string) => {
    if (typing) return
    return turn(text, async () => {
      const question: ChatTurn = { role: "user", text }
      setThinking(true)
      try {
        const reply = await sendChat([...history, question], emergencyButton, profile)
        setThinking(false)
        const { replies, links, emergency, phones } = reply
        setProfile(reply.profile)
        saveProfile(reply.profile)
        setAsksLocation(reply.asksLocation)
        setOfferingPerson(reply.offerPerson)
        setHistory((current) => [...current, question, { role: "assistant", text: replies.join("\n\n") }])
        // The numbers for this situation (Auxi's, or ambulance and 911 in an emergency without any), not shown before
        const picked = phones.length > 0 ? phones : emergency ? BASIC_EMERGENCY_NUMBERS : []
        const calls = picked.filter(({ number }) => !shownNumbers.includes(number))
        setShownNumbers((current) => [...current, ...calls.map(({ number }) => number)])
        // One bubble each (the chat shows them one after another): the numbers to call under the first one
        // (it's the one telling to call), the suggested pages under the last one
        for (const [index, text] of replies.entries()) {
          const last = index === replies.length - 1
          add({ from: "auxi", text, phones: index === 0 ? calls : undefined, links: last ? links : undefined })
        }
      } catch {
        setThinking(false)
        add({ from: "auxi", text: CONNECTION_ERROR_REPLY })
      }
    })
  }

  /** "Seguir con Auxi": answered right away, like Sí / No */
  const keepWithAuxi = () =>
    turn(OFFER_LABELS.no, async () => {
      await wait(LOCAL_REPLY_DELAY_MS)
      add({ from: "auxi", text: KEEP_WITH_AUXI_REPLY })
      setHistory((current) => [...current, { role: "user", text: OFFER_LABELS.no }, { role: "assistant", text: KEEP_WITH_AUXI_REPLY }])
    })

  /** "Sí, quiero hablar con alguien": the buttons go, and the answer stays in the history for when they come back */
  const acceptPerson = () => {
    setOfferingPerson(false)
    add({ from: "user", text: OFFER_LABELS.yes })
    const withAnswer: ChatTurn[] = [...history, { role: "user", text: OFFER_LABELS.yes }]
    setHistory(withAnswer)
    return withAnswer
  }

  /** "¿Necesitás hablar con alguien?" in the header: Auxi asks, with the buttons to answer (and no emergency question pending) */
  const offerPerson = () => {
    setAskingEmergency(false)
    setOfferingPerson(true)
    // Nothing said yet: the greeting and straight to the offer, instead of the emergency question left unanswered
    if (!messages.some((message) => message.from === "user")) {
      const greeting = WELCOME_MESSAGES[0]
      setMessages([withId(greeting), withId({ from: "auxi", text: PERSON_OFFER })])
      setHistory([{ role: "assistant", text: greeting.text }, { role: "assistant", text: PERSON_OFFER }])
      return
    }
    add({ from: "auxi", text: PERSON_OFFER })
    setHistory((current) => [...current, { role: "assistant", text: PERSON_OFFER }])
  }

  /** Back from the chat with a person: Auxi picks up again */
  const welcomeBack = () => {
    add({ from: "auxi", text: WELCOME_BACK_REPLY })
    setHistory((current) => [...current, { role: "assistant", text: `${BACK_FROM_PERSON_NOTE} ${WELCOME_BACK_REPLY}` }])
  }

  return {
    messages,
    typing,
    thinking,
    askingEmergency: askingEmergency && !typing,
    offeringPerson: offeringPerson && !typing,
    asksLocation,
    answerEmergency,
    keepWithAuxi,
    acceptPerson,
    offerPerson,
    welcomeBack,
    write,
  }
}
