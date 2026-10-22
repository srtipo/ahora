/**
 * App typeface.
 *
 * Inter Tight, packaged in assets/fonts/ and loaded by expo-font in the root
 * layout. The name here is the key the font is registered under, so both have
 * to match.
 */
export const fontFamily = "Inter Tight";

/**
 * Design line height: 1.2 of the font size.
 * @param fontSize Font size in pixels.
 */
export function lineHeight(fontSize: number) {
  return Math.round(fontSize * 1.2);
}
