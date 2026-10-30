import type { ComponentType } from "react";
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";
import type { IconProps } from "@/presentation/icons";
import { NO_INPUT_FOCUS } from "@/presentation/pressable";
import { fontFamily, lineHeight, useTheme } from "@/theme";

export type PillButtonProps = {
  /** Pill label. */
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

const HEIGHT = 36;
const RADIUS = 18;
const PADDING_H = 14;
const GAP = 12;
const FONT_SIZE = 13;
const ICON_SIZE = 16;

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
  icon: Icon,
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
      {...NO_INPUT_FOCUS}
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
