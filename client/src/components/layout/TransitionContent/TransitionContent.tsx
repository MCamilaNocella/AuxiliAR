import type { TransitionContentProps } from "./TransitionContent.types"

/**
 * The part of a screen that changes with changeContent (utils/contentTransition): it fades out and the new one fades in, while the
 * rest of the screen stays still. Use one per screen at a time (e.g. a category's section, or its intro).
 */
export const TransitionContent = ({ className = "", children }: TransitionContentProps) => (
  <div data-transition-content className={className}>
    {children}
  </div>
)
