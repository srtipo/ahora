/* eslint-disable react-hooks/immutability --
   Reanimated shared values are mutable by design: the React Compiler rules do
   not know about them. */
import type { ComponentType } from "react";
import { useCallback, useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Check, type IconProps } from "../icons";
import { fontFamily, lineHeight } from "../../theme/fonts";
import { useTheme } from "../../theme/ThemeProvider";

/**
 * Task card state.
 *
 * "marked" is the priority one: it is the only task that is tinted and the
 * only one that shows the dot. "done" is the task that was completed during
 * the day: it stays in the list until the day changes.
 */
export type TaskCardState = "normal" | "marked" | "done";

export type TaskCardProps = {
  /** Task text. */
  text: string;
  /** State. Default "normal". */
  state?: TaskCardState;
  /**
   * The tray: the sign of the swipe.
   *
   * It appears in the hole the card leaves, where the text was. It arrives
   * with the size and the color of the design (24, soft gray).
   */
  tray?: ComponentType<IconProps>;
  /**
   * Action when the card is swiped to the right.
   *
   * The card does not decide what happens: it drags, it shows the tray and
   * it tells. Without this prop there is no swipe.
   */
  onSwipeOut?: () => void;
  /** Action on press. */
  onPress?: () => void;
  /** Screen reader label. Default: the `text`. */
  accessibilityLabel?: string;
  /** Identifier for tests. */
  testID?: string;
  /** Layout tweaks: margins. */
  style?: StyleProp<ViewStyle>;
};

const MIN_HEIGHT = 64;
const RADIUS = 12;
const PADDING = 40;
const FONT_SIZE = 16;

/**
 * The tick of the completed card.
 *
 * The tick belongs to the card: it is the sign of the "done" state, the same
 * one the "hecho" button uses, so it is not injected.
 */
const CHECK_SIZE = 20;

/**
 * The right padding of the completed card.
 *
 * The design puts the tick 34 px from the right edge, against the 40 px of
 * the text on the left. It is not symmetric and it is not a mistake: the tick
 * sits where the buttons used to be.
 */
const PADDING_RIGHT_DONE = 34;

/** How far the finger has to travel to count as "out of today". */
const SWIPE_THRESHOLD = 100;

/**
 * The pan only activates after this horizontal movement, so the finger may
 * already have travelled that much when the card starts moving. The card
 * follows the finger from the first touch anyway, so this is only the margin
 * that decides if the gesture was a swipe and not a tap.
 */
const ACTIVE_OFFSET = 12;

/** The tray of the hole. */
const TRAY_SIZE = 24;

/** How far the card goes past the edge when it leaves. */
const SWIPE_EXIT = 40;

const SWIPE_DURATION = 180;

const styles = StyleSheet.create({
  slot: {
    overflow: "visible",
  },
  tray: {
    position: "absolute",
    left: PADDING,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
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
 * The card of the three tasks of Ahora.
 *
 * It has no width of its own: it stretches to whatever the list gives it, so
 * the same card works on any screen. The height is the one of the design (64),
 * but it is a minimum, so a task with a long text grows instead of being cut.
 *
 * It can be dragged to the right: that is "sacar de hoy". While it drags, the
 * tray appears in the hole it leaves.
 */
export function TaskCard({
  text,
  state = "normal",
  tray: Tray,
  onSwipeOut,
  onPress,
  accessibilityLabel,
  testID,
  style,
}: TaskCardProps) {
  const { palette } = useTheme();
  const marked = state === "marked";
  const done = state === "done";

  const translateX = useSharedValue(0);
  const width = useSharedValue(0);
  const touchX = useSharedValue(0);

  const notifySwipedOut = useCallback(() => {
    onSwipeOut?.();
  }, [onSwipeOut]);

  const swipe = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!!onSwipeOut)
        .activeOffsetX([-ACTIVE_OFFSET, ACTIVE_OFFSET])
        .failOffsetY([-16, 16])
        .onTouchesDown((event) => {
          const touch = event.allTouches[0];
          if (touch) touchX.value = touch.absoluteX;
        })
        .onUpdate((event) => {
          translateX.value = Math.max(0, event.absoluteX - touchX.value);
        })
        .onEnd(() => {
          if (translateX.value >= SWIPE_THRESHOLD) {
            translateX.value = withTiming(
              width.value + SWIPE_EXIT,
              { duration: SWIPE_DURATION },
              (finished) => {
                if (finished) scheduleOnRN(notifySwipedOut);
              },
            );
          } else {
            translateX.value = withSpring(0);
          }
        }),
    [notifySwipedOut, onSwipeOut, touchX, translateX, width],
  );

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const trayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <GestureDetector gesture={swipe}>
      <Animated.View
        style={styles.slot}
        onLayout={(event) => {
          width.value = event.nativeEvent.layout.width;
        }}
      >
        {Tray ? (
          <Animated.View style={[styles.tray, trayStyle]}>
            <Tray size={TRAY_SIZE} color={palette.textSoft} />
          </Animated.View>
        ) : null}

        <Animated.View style={cardStyle}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel ?? text}
            accessibilityState={{ selected: marked }}
            disabled={!onPress}
            onPress={onPress}
            testID={testID}
            style={[
              styles.base,
              {
                minHeight: MIN_HEIGHT,
                borderRadius: RADIUS,
                paddingLeft: PADDING,
                paddingRight: done ? PADDING_RIGHT_DONE : PADDING,
                borderWidth: 1,
                borderColor: marked ? palette.accent : palette.border,
                backgroundColor: marked ? palette.accentSoft : palette.surface,
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
                  color: done ? palette.mutedText : palette.text,
                },
              ]}
            >
              {text}
            </Text>
            {done ? <Check size={CHECK_SIZE} color={palette.textSoft} /> : null}
          </Pressable>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}
