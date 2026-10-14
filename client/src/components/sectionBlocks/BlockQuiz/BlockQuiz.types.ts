export type QuizItem = {
  id: string
  topic: string
  prompt: string
  options: { text: string, correct: boolean, feedback: string }[]
  learning: string
}

export type BlockQuizProps = {
  questions: QuizItem[]
  /** Auxi's line next to the questions (big screens) */
  cheer?: string
  /** What the end screen says under its title */
  endText?: string
}
