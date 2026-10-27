import { StyleSheet, Text, type StyleProp, type TextStyle } from "react-native";
import { fontFamily, lineHeight, useTheme } from "@/theme";

export type CountdownProps = {
  /** Seconds left. Anything below zero is shown as zero. */
  seconds: number;
  /** Font size. Default 104. */
  size?: number;
  /** Horizontal alignment. Default "center". */
  align?: "left" | "center" | "right";
  /** Text color. Default the main text color. */
  color?: string;
  /** Identifier for tests. */
  testID?: string;
  /** Text tweaks. */
  style?: StyleProp<TextStyle>;
};

/**
 * Seconds left as "m:ss".
 *
 * 300 is "5:00" and 0 is "0:00", the two states of the "Contador" in the
 * design. The seconds always have two digits, so the number does not jump
 * sideways while it runs.
 */
export function formatCountdown(seconds: number) {
  const left = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(left / 60);
  const rest = left % 60;

  return `${minutes}:${rest.toString().padStart(2, "0")}`;
}

const styles = StyleSheet.create({
  text: {
    fontFamily,
    includeFontPadding: false,
  },
});

/**
 * The number of the block.
 *
 * It is the "Contador" of Penpot: the only thing that tells how much is left,
 * no bar and no icon (the number says more in less space). At 104 px it is
 * the biggest thing on the block screen.
 */
export function Countdown({
  seconds,
  size = 104,
  align = "center",
  color,
  testID,
  style,
}: CountdownProps) {
  const { palette } = useTheme();

  return (
    <Text
      testID={testID}
      style={[
        styles.text,
        {
          color: color ?? palette.text,
          fontSize: size,
          lineHeight: lineHeight(size),
          textAlign: align,
        },
        style,
      ]}
    >
      {formatCountdown(seconds)}
    </Text>
  );
}
