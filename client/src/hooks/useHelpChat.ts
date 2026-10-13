import { useSyncExternalStore } from "react"
import { helpChatStore } from "@/stores/helpChatStore"

/** Whether Auxi's chat is open, which conversation it shows and what it's for */
export const useHelpChat = () => useSyncExternalStore(helpChatStore.subscribe, helpChatStore.getSnapshot)
