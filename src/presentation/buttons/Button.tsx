import type { ComponentType } from "react";
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";
import type { IconProps } from "@/presentation/icons";
import { NO_INPUT_FOCUS } from "@/presentation/pressable";
import { fontFamily, lineHeight, useTheme } from "@/theme";
import { Spinner } from "./Spinner";

/** Button scale. */
export type ButtonSize = "large" | "medium" | "small";

/**
 * Button state.
 *
 * "pressed" is not a state: the `Pressable` handles it internally. "done" is not
 * one either: it is a regular button with the check mark icon and the text
 * "hecho".
 */
export type ButtonState = "default" | "loading";

export type ButtonProps = {
  /** Button label. */
  text: string;
  /** Scale. Default "large". */
  size?: ButtonSize;
  /** State. Default "default". */
  state?: ButtonState;
  /**
   * Icon to the left of the label.
   *
   * The button renders it with the size of its scale (20 on large, 16 on
   * medium, 14 on small) and the color of its state, so the icon follows the
   * text when the button is pressed or disabled.
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

type Metrics = {
  fontSize: number;
  height: number;
  radius: number;
  paddingH: number;
  iconSize: number;
};

const METRICS: Record<ButtonSize, Metrics> = {
  large: { fontSize: 18, height: 56, radius: 28, paddingH: 24, iconSize: 20 },
  medium: { fontSize: 15, height: 48, radius: 24, paddingH: 20, iconSize: 16 },
  small: { fontSize: 13, height: 44, radius: 22, paddingH: 16, iconSize: 14 },
};

const GAP = 8;

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
 * The primary button.
 *
 * Terracotta, with the label of the action. It is the button of the block: it
 * says "Empezar" and, when the block is over, it says "hecho" with the check
 * mark.
 */
export function Button({
  text,
  size = "large",
  state = "default",
  icon: Icon,
  disabled = false,
  onPress,
  accessibilityLabel,
  testID,
  style,
}: ButtonProps) {
  const { palette } = useTheme();
  const metrics = METRICS[size];
  const loading = state === "loading";
  const inactive = disabled || loading;

  const background = disabled ? palette.mutedBg : palette.accent;
  const textColor = disabled ? palette.mutedText : palette.onAccent;

  return (
    <Pressable
      {...NO_INPUT_FOCUS}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? text}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        {
          height: metrics.height,
          borderRadius: metrics.radius,
          paddingHorizontal: metrics.paddingH,
          backgroundColor: pressed ? palette.accentPressed : background,
        },
        style,
      ]}
    >
      {loading ? (
        <Spinner size={metrics.iconSize} color={textColor} />
      ) : (
        Icon && <Icon size={metrics.iconSize} color={textColor} />
      )}
      <Text
        style={[
          styles.text,
          {
            fontSize: metrics.fontSize,
            lineHeight: lineHeight(metrics.fontSize),
            color: textColor,
          },
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
}
