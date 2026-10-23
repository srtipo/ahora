import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { fontFamily, lineHeight } from "../../theme/fonts";
import { useTheme } from "../../theme/ThemeProvider";

/**
 * Inbox row state.
 *
 * "marked" is the priority one: it is the only row that is tinted, with a
 * terracotta border. It carries no dot: the colour says which one it is.
 * There is no "done" here: a task that is completed leaves the inbox.
 */
export type InboxItemState = "normal" | "marked";

export type InboxItemProps = {
  /** Task text. */
  text: string;
  /** State. Default "normal". */
  state?: InboxItemState;
  /** Action on press. */
  onPress?: () => void;
  /** Action on long press. */
  onLongPress?: () => void;
  /** Screen reader label. Default: the `text`. */
  accessibilityLabel?: string;
  /** Identifier for tests. */
  testID?: string;
  /** Layout tweaks: margins. */
  style?: StyleProp<ViewStyle>;
};

const MIN_HEIGHT = 48;
const RADIUS = 10;
const PADDING = 16;
const FONT_SIZE = 14;

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    flex: 1,
    fontFamily,
    includeFontPadding: false,
  },
});

/**
 * The row of the inbox.
 *
 * It is a shorter card than the one of Ahora: 48 high, smaller radius,
 * smaller text and a tighter padding. It has no width of its own either: it
 * stretches to the width of the list.
 */
export function InboxItem({
  text,
  state = "normal",
  onPress,
  onLongPress,
  accessibilityLabel,
  testID,
  style,
}: InboxItemProps) {
  const { palette } = useTheme();
  const marked = state === "marked";

  const background = marked ? palette.accentSoft : palette.surfaceMuted;
  const borderColor = marked ? palette.accent : "transparent";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? text}
      accessibilityState={{ selected: marked }}
      disabled={!onPress && !onLongPress}
      onPress={onPress}
      onLongPress={onLongPress}
      testID={testID}
      style={[
        styles.base,
        {
          minHeight: MIN_HEIGHT,
          borderRadius: RADIUS,
          paddingLeft: PADDING,
          paddingRight: PADDING,
          // The border is always one pixel so the text does not move when the
          // row is marked. When there is no visible border it is transparent.
          borderWidth: 1,
          borderColor,
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
            color: palette.text,
          },
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
}
