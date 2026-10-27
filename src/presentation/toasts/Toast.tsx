import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { fontFamily, lineHeight, useTheme } from "@/theme";

/**
 * The kind of the toast.
 *
 * "ok" is the dark pill, for the confirmations. "error" is the terracotta
 * one, for the failures.
 */
export type ToastKind = "ok" | "error";

export type ToastProps = {
  /** The message. */
  message: string;
  /** Kind of the toast. Default "ok". */
  kind?: ToastKind;
  /** Layout tweaks. */
  style?: StyleProp<ViewStyle>;
};

const HEIGHT = 40;
const RADIUS = 20;
const PADDING_H = 16;
const FONT_SIZE = 14;

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily,
    includeFontPadding: false,
  },
});

/**
 * The pill of the toast.
 *
 * It comes down from the top edge of the screen: the phone is face down and
 * nobody is looking at it, so the message has to arrive and go away on its
 * own.
 */
export function Toast({ message, kind = "ok", style }: ToastProps) {
  const { palette } = useTheme();

  const background = kind === "error" ? palette.accent : palette.text;
  const color = kind === "error" ? palette.surface : palette.bg;

  return (
    <View
      style={[
        styles.base,
        {
          height: HEIGHT,
          borderRadius: RADIUS,
          paddingHorizontal: PADDING_H,
          backgroundColor: background,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: FONT_SIZE,
            lineHeight: lineHeight(FONT_SIZE),
            color,
          },
        ]}
      >
        {message}
      </Text>
    </View>
  );
}
