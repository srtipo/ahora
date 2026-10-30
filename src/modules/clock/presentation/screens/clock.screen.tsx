import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetNowTask } from "@/modules/clock/hooks";
import { DoneButton } from "@/modules/clock/presentation/components";
import { BackLink, Button } from "@/presentation/buttons";
import { Chevron } from "@/presentation/icons";
import { Countdown } from "@/presentation/timers";
import { fontFamily, lineHeight, useTheme } from "@/theme";

/** The gap between the sides of the screen and what is on it. */
const SIDE = 24;

/** The gap between the top of the screen and the link that comes back. */
const LINK_TOP = 8;

/**
 * The gap between the link and the name of the task.
 *
 * It is the space of the design: the link ends and the name of the task
 * starts 33 px below it.
 */
const TASK_GAP = 33;

/**
 * The gap between the name of the task and the counter.
 *
 * The number is the biggest thing on the screen and it needs air around it:
 * 94 px between them, as in the design.
 */
const TIMER_GAP = 94;

/**
 * The gap between the counter and the button.
 *
 * The number is the biggest thing on the screen and the button is at the
 * bottom of it: 135 px between them, as in the design.
 */
const BUTTON_GAP = 135;

/** The size of the name of the task. */
const TASK_SIZE = 16;

/** The length of the block, in seconds. Five minutes. */
const BLOCK_SECONDS = 300;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SIDE,
  },
  content: {
    paddingHorizontal: SIDE,
  },
  task: {
    marginTop: TASK_GAP,
    fontFamily,
    includeFontPadding: false,
  },
  timer: {
    marginTop: TIMER_GAP,
    // The counter is centered in the width of the content, not in the
    // space its own text takes: the number is in the middle of the screen.
    width: "100%",
  },
  button: {
    marginTop: BUTTON_GAP,
    alignSelf: "center",
  },
});

/**
 * Bloque: the screen of the block of five minutes.
 *
 * It is where the task of Ahora goes when it is tapped: the card does not
 * start anything, it takes you here.
 *
 * The screen has the three things of the design: the link that comes back,
 * the name of the task that is being worked on and the counter. The counter
 * shows the five minutes whole, and the clock starts when the user says so.
 */
export default function ClockScreen() {
  const { palette } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { task } = useLocalSearchParams<{ task: string }>();
  const { data: currentTask } = useGetNowTask(task);

  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  // The seconds left, calculated from the moment the block started.
  const seconds =
    startedAt === null
      ? BLOCK_SECONDS
      : Math.max(0, Math.ceil((startedAt + BLOCK_SECONDS * 1000 - now) / 1000));

  // The block runs while it has time left.
  const running = startedAt !== null && seconds > 0;

  // The clock moves while the block runs.
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => setNow(Date.now()), 1000);

    return () => clearInterval(interval);
  }, [running]);

  const onStart = () => {
    const moment = Date.now();

    setStartedAt(moment);
    setNow(moment);
  };

  return (
    <View style={[styles.root, { backgroundColor: palette.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + LINK_TOP }]}>
        <BackLink text="Ahora" icon={Chevron} onPress={() => router.back()} />
      </View>

      <View style={styles.content}>
        <Text
          style={[
            styles.task,
            {
              fontSize: TASK_SIZE,
              lineHeight: lineHeight(TASK_SIZE),
              color: palette.textSoft,
            },
          ]}
        >
          {currentTask?.name}
        </Text>

        <Countdown seconds={seconds} style={styles.timer} />

        {/*
          The block has one button at a time: "Empezar" before the countdown
          starts and "Hecho" after. The task can only be made done inside
          the block, so the button of the block is the one that appears
          when the countdown starts.
        */}
        {startedAt === null ? (
          <Button text="Empezar" onPress={onStart} style={styles.button} />
        ) : (
          <DoneButton
            taskId={task}
            onDone={() => router.back()}
            style={styles.button}
          />
        )}
      </View>
    </View>
  );
}
