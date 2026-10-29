import { useState, type ComponentType } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import type { IconProps } from "@/presentation/icons";
import { NO_INPUT_FOCUS } from "@/presentation/pressable";
import { fontFamily, lineHeight, useTheme } from "@/theme";

export type BackLinkProps = {
  /** Link label. */
  text: string;
  /**
   * Icon to the left of the label.
   *
   * The button renders it with its size (16) and the color of its state, so
   * the icon follows the text when the button is pressed or disabled.
   */
  icon?: ComponentType<IconProps>;
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
const ICON_SIZE = 16;

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
  icon: Icon,
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
      {...NO_INPUT_FOCUS}
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
      {Icon ? <Icon size={ICON_SIZE} color={textColor} /> : null}
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
