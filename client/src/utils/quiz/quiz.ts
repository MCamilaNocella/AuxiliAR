/*
 * Logic of a short educational quiz: one situation at a time, immediate feedback, and a way to go over what was
 * missed. Pure functions (no React), so it can be tested on its own.
 */

export type QuizAction = {
  label: string
  /** Internal route (with its query) */
  to?: string
  /** Brings the emergency numbers into view instead of navigating */
  emergency?: boolean
}

export type QuizOption = {
  id: string
  text: string
  correct: boolean
  /** Why this answer is (or isn't) the right one, said kindly. Shown when the person picks it */
  feedback: string
}

export type QuizQuestion = {
  id: string
  /** Kind of question, shown as a small label ("Verdadero o falso", "¿Dónde ir?"…) */
  format: string
  /** What the question is about, for the final review */
  topic: string
  prompt: string
  options: QuizOption[]
  /** The reason behind the right answer, shown after answering whatever was picked */
  why: string
  /** What the person takes with them: one sentence for the final review */
  learning: string
  /** A real thing to do in AuxiliAR related to the situation */
  action?: QuizAction
}

export type QuizResult = { questionId: string, optionId: string, correct: boolean }

export type QuizState = {
  /** The questions of this round (all of them, or only the ones missed) */
  round: QuizQuestion[]
  index: number
  /** Option picked in the current question; `null` until answered */
  picked: string | null
  results: QuizResult[]
  finished: boolean
}

export const startQuiz = (questions: QuizQuestion[]): QuizState => ({ round: questions, index: 0, picked: null, results: [], finished: false })

export const currentQuestion = (state: QuizState) => state.round[state.index]

/** Answers the current question; a second answer to the same question is ignored */
export const pickOption = (state: QuizState, optionId: string): QuizState => {
  const question = currentQuestion(state)
  const option = question?.options.find(({ id }) => id === optionId)
  if (!question || !option || state.picked !== null || state.finished) return state
  return { ...state, picked: optionId, results: [...state.results, { questionId: question.id, optionId, correct: option.correct }] }
}

/** Moves on after an answer: to the next question, or to the end */
export const advance = (state: QuizState): QuizState => {
  if (state.picked === null || state.finished) return state
  const isLast = state.index === state.round.length - 1
  return isLast ? { ...state, finished: true } : { ...state, index: state.index + 1, picked: null }
}

export const correctCount = (state: QuizState) => state.results.filter(({ correct }) => correct).length

/** The questions answered wrongly in this round, in the order they came */
export const missedQuestions = (state: QuizState) => state.round.filter(({ id }) => state.results.some((result) => result.questionId === id && !result.correct))

/** Percent of the round already answered (the current question counts once it is answered) */
export const progressPercent = (state: QuizState) => Math.round(((state.finished ? state.round.length : state.index + (state.picked === null ? 0 : 1)) / state.round.length) * 100)
