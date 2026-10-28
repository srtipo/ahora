/**
 * The props that keep a button out of the input focus.
 *
 * The app is touch only. When something appears in the screen --the toast,
 * for example-- the system looks for a view to give the focus to, and it
 * lands on the first button: it draws its focus ring on top of it, a gray
 * rectangle around the button that stays there until something else
 * repaints the screen.
 *
 * The button stays in the accessibility tree --TalkBack still reads it and
 * it still has its role and its label-- but it does not take the focus.
 */
export const NO_INPUT_FOCUS = {
  accessible: false,
  importantForAccessibility: "yes",
  focusable: false,
} as const;
