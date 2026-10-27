import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { fontFamily, lineHeight, useTheme } from "@/theme";

/**
 * Field state.
 *
 * "default" is the field of the inbox: gray border. "marked" is the field of
 * Ahora: terracotta border, and what you write there is born marked.
 */
export type TextFieldVariant = "default" | "marked";

export type TextFieldProps = {
  /** Text inside the field. */
  value?: string;
  /** Placeholder. Default "Anotar algo". */
  placeholder?: string;
  /** State of the field. Default "default". */
  variant?: TextFieldVariant;
  /**
   * Message under the field.
   *
   * Passing it is what makes the field fail: the border stays as it is and
   * the message appears below. The toast says that it failed, this says which
   * field failed.
   */
  errorMessage?: string;
  /** Called on every keystroke. */
  onChangeText?: (text: string) => void;
  /** Called when the user presses the keyboard's done key. */
  onSubmit?: () => void;
  /** Focuses the field when the screen opens. Default false. */
  autoFocus?: boolean;
  /** Blocks editing. Default true. */
  editable?: boolean;
  /** Screen reader label. Default: the `placeholder`. */
  accessibilityLabel?: string;
  /** Identifier for tests. */
  testID?: string;
  /** Layout tweaks: margins, max width. */
  style?: StyleProp<ViewStyle>;
  /** Text tweaks: font size, color. */
  textStyle?: StyleProp<TextStyle>;
};

const HEIGHT = 52;
const RADIUS = 14;
const BORDER_WIDTH = 1;
const PADDING_H = 16;
const FONT_SIZE = 15;
const ERROR_FONT_SIZE = 13;
const ERROR_GAP = 12;

const styles = StyleSheet.create({
  wrapper: {
    // The field takes the width of whatever holds it, like the "Campo
    // flexible" board in Penpot. The width is explicit so it also fills when
    // the parent centers its children, and it can still shrink.
    width: "100%",
    alignSelf: "stretch",
    flexShrink: 1,
    minWidth: 0,
  },
  input: {
    width: "100%",
    height: HEIGHT,
    borderRadius: RADIUS,
    borderWidth: BORDER_WIDTH,
    paddingHorizontal: PADDING_H,
    paddingVertical: 0,
    fontFamily,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  error: {
    marginTop: ERROR_GAP,
    fontFamily,
    includeFontPadding: false,
  },
});

/**
 * The field to write in.
 *
 * It is the "Campo flexible" of Penpot: white, 52 high, radius 14, one pixel
 * of border and the text 16 px from the edge. The only thing that changes
 * between states is the border color, and the error adds a line underneath.
 */
export function TextField({
  value,
  placeholder = "Anotar algo",
  variant = "default",
  errorMessage,
  onChangeText,
  onSubmit,
  autoFocus = false,
  editable = true,
  accessibilityLabel,
  testID,
  style,
  textStyle,
}: TextFieldProps) {
  const { palette } = useTheme();

  const borderColor = variant === "marked" ? palette.accent : palette.border;

  return (
    <View style={[styles.wrapper, style]}>
      <TextInput
        accessibilityLabel={accessibilityLabel ?? placeholder}
        autoFocus={autoFocus}
        editable={editable}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={palette.textSoft}
        returnKeyType="done"
        testID={testID}
        value={value}
        style={[
          styles.input,
          {
            backgroundColor: palette.surface,
            borderColor,
            color: palette.text,
            fontSize: FONT_SIZE,
            lineHeight: lineHeight(FONT_SIZE),
          },
          textStyle,
        ]}
      />
      {errorMessage ? (
        <Text
          style={[
            styles.error,
            {
              color: palette.accent,
              fontSize: ERROR_FONT_SIZE,
              lineHeight: lineHeight(ERROR_FONT_SIZE),
            },
          ]}
        >
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
}
