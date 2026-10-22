import { useState, type ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { fontFamily, lineHeight } from "../../theme/fonts";
import { useTheme } from "../../theme/ThemeProvider";
import { colorIcon } from "./colorIcon";

export type BackLinkProps = {
  /** Link label. */
  text: string;
  /**
   * Icon to the left of the label.
   *
   * The button injects the state `color` into it, so the icon should accept it
   * The `size` is up to the screen: 16.
   */
  icon?: ReactNode;
  /** Blocks interaction and paints the disabled state. Default false. */
  disabled?: boolean;
  /** Action on press. */
  onPress?: () => void;
  /** Screen reader label. Default: the `text`. */
  accessibilityLabel?: string;
  /** Identifier for tests. */
  testID?: string;
  /** Layout tweaks: full width, margins. */
  style?: StyleProp<ViewStyle>;
};

const GAP = 8;
const FONT_SIZE = 13;

/** The link is 17 high: without a hit slop the finger cannot grab it. */
const HIT_SLOP = { top: 12, bottom: 12, left: 8, right: 8 };

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    gap: GAP,
  },
  text: {
    fontFamily,
    includeFontPadding: false,
  },
});

/**
 * The tertiary button: a link.
 *
 * It is the "‹ Ahora" that comes back from the Block and the Inbox. No
 * background, soft gray, and it darkens when pressed.
 */
export function BackLink({
  text,
  icon,
  disabled = false,
  onPress,
  accessibilityLabel,
  testID,
  style,
}: BackLinkProps) {
  const { palette } = useTheme();
  const [pressed, setPressed] = useState(false);

  const textColor = disabled
    ? palette.mutedText
    : pressed
      ? palette.text
      : palette.textSoft;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? text}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => !disabled && setPressed(true)}
      onPressOut={() => setPressed(false)}
      hitSlop={HIT_SLOP}
      testID={testID}
      style={[styles.base, style]}
    >
      {icon ? colorIcon(icon, textColor) : null}
      <Text
        style={[
          styles.text,
          {
            fontSize: FONT_SIZE,
            lineHeight: lineHeight(FONT_SIZE),
            color: textColor,
          },
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
}
