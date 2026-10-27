import { StyleSheet, View } from "react-native";
import type { StackTask } from "@/core";
import { Spinner } from "@/presentation/buttons";
import { InboxItem, type InboxItemState } from "@/presentation/cards";
import { useTheme } from "@/theme";

/** The gap between the field and the list. */
const TOP_GAP = 32;

/** The gap between the rows of the list. */
const ROW_GAP = 8;

/** The side of the spinner of the loading state. */
const SPINNER_SIZE = 20;

/** The height of a row: the space the loading state leaves for the list. */
const ROW_HEIGHT = 48;

const styles = StyleSheet.create({
  list: {
    marginTop: TOP_GAP,
    gap: ROW_GAP,
  },
  loading: {
    marginTop: TOP_GAP,
    minHeight: ROW_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
});

/**
 * The state of the row of a task.
 *
 * The marked one is the only one that is tinted: the color says which one it
 * is. There is no "done" here: a task that is completed leaves the stack.
 */
function itemState(task: StackTask): InboxItemState {
  return task.marked ? "marked" : "normal";
}

export type StackTaskListProps = {
  /** The tasks of the stack. */
  tasks: StackTask[];
  /** Whether the tasks are still being read. */
  loading?: boolean;
};

/**
 * The list of the tasks of the stack.
 *
 * It has the three states of a list that comes from a base: the loading one,
 * with the spinner; the empty one, that draws nothing and leaves the screen
 * with the title, in silence; and the one with tasks.
 */
export function StackTaskList({ tasks, loading = false }: StackTaskListProps) {
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
        <InboxItem key={task.id} text={task.name} state={itemState(task)} />
      ))}
    </View>
  );
}
