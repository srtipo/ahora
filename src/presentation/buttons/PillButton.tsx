import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";
import { fontFamily, lineHeight } from "../../theme/fonts";
import { useTheme } from "../../theme/ThemeProvider";
import { colorIcon } from "./colorIcon";

export type PillButtonProps = {
  /** Pill label. */
  text: string;
  /**
   * Icon to the left of the label.
   *
   * The button injects the state `color` into it, so the icon should accept it
   * (like Bandeja, Tilde and Chevron do). The `size` is up to the screen: 16.
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

const HEIGHT = 36;
const RADIUS = 18;
const PADDING_H = 14;
const GAP = 12;
const FONT_SIZE = 13;

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: GAP,
  },
  text: {
    fontFamily,
    includeFontPadding: false,
  },
});

/**
 * The secondary button: a pill.
 *
 * It is the "Buzón" pill, top right on Ahora. Card background, light border and
 * the tray inside.
 */
export function PillButton({
  text,
  icon,
  disabled = false,
  onPress,
  accessibilityLabel,
  testID,
  style,
}: PillButtonProps) {
  const { palette } = useTheme();

  const textColor = disabled ? palette.mutedText : palette.text;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? text}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        {
          height: HEIGHT,
          borderRadius: RADIUS,
          paddingHorizontal: PADDING_H,
          borderWidth: 1,
          borderColor: palette.border,
          backgroundColor: pressed || disabled ? palette.mutedBg : palette.surface,
        },
        style,
      ]}
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
