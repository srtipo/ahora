import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

/**
 * Hands the icon the color of the state the button is in.
 *
 * Icons arrive as an already built `ReactNode`, so the color cannot travel in
 * the prop: the button injects it into the element. Bandeja, Tilde and Chevron
 * accept `color`, which is what makes the icon follow the text when the button
 * is pressed or disabled.
 *
 * If the node is not an element, or it does not accept `color`, it is returned
 * untouched.
 */
export function colorIcon(icon: ReactNode, color: string): ReactNode {
  if (!isValidElement(icon)) return icon;

  return cloneElement(icon as ReactElement<{ color?: string }>, { color });
}
