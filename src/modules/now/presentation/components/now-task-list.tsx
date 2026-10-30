import { StyleSheet, View } from "react-native";
import type { NowTask } from "@/core";
import { Spinner } from "@/presentation/buttons";
import { TaskCard, type TaskCardState } from "@/presentation/cards";
import { useTheme } from "@/theme";

/** The gap between the title and the list. */
const TOP_GAP = 28;

/** The gap between the rows of the list. */
const ROW_GAP = 12;

/** The side of the spinner of the loading state. */
const SPINNER_SIZE = 20;

/** The height of a card: the space the loading state leaves for the list. */
const CARD_HEIGHT = 64;

const styles = StyleSheet.create({
  list: {
    marginTop: TOP_GAP,
    gap: ROW_GAP,
  },
  loading: {
    marginTop: TOP_GAP,
    minHeight: CARD_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
});

/**
 * The state of the card of a task.
 *
 * A task that is done is drawn as done, with the tick, and a task that is
 * marked is drawn highlighted. A task that is both is drawn as done: the
 * completion is the stronger signal.
 */
function cardState(task: NowTask): TaskCardState {
  if (task.status === "done") return "done";
  if (task.marked) return "marked";

  return "normal";
}

export type NowTaskListProps = {
  /** The tasks of now, the ones completed today first. */
  tasks: NowTask[];
  /** Whether the tasks are still being read. */
  loading?: boolean;
  /**
   * Action when a task is tapped.
   *
   * The list does not decide what happens: it tells, and the screen does the
   * rest.
   */
  onPressTask?: (task: NowTask) => void;
};

/**
 * The list of the tasks of now.
 *
 * It has the three states of a list that comes from a base: the loading one,
 * with the spinner; the empty one, that draws nothing and leaves the screen
 * with the title and the field, in silence; and the one with tasks.
 */
export function NowTaskList({
  tasks,
  loading = false,
  onPressTask,
}: NowTaskListProps) {
  const { palette } = useTheme();

  if (loading) {
    return (
      <View style={styles.loading}>
        <Spinner size={SPINNER_SIZE} color={palette.textSoft} />
      </View>
    );
  }

  if (tasks.length === 0) return null;

  return (
    <View style={styles.list}>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          text={task.name}
          state={cardState(task)}
          // A task that is already done does not open a block: it is over.
          onPress={
            task.status === "done" ? undefined : () => onPressTask?.(task)
          }
        />
      ))}
    </View>
  );
}
