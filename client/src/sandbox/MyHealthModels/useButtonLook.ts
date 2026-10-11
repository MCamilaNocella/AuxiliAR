import { useContext } from "react"
import { ButtonLookContext } from "./ButtonLookContext"

/** True when the current model uses style 3 buttons (soft fill, no border, slightly rounded) */
export const useSoftButtons = () => useContext(ButtonLookContext) === "soft"
