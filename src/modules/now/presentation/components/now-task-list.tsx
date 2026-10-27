import { StyleSheet, View } from "react-native";
import type { NowTask } from "@/core";
import { TaskCard, type TaskCardState } from "@/presentation/cards";

/** The gap between the title and the list. */
const TOP_GAP = 28;

/** The gap between the rows of the list. */
const ROW_GAP = 12;

const styles = StyleSheet.create({
  list: {
    marginTop: TOP_GAP,
    gap: ROW_GAP,
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

/**
 * The list of the tasks of now.
 *
 * The empty state is here too: when there is nothing to do, the list draws
 * nothing and the screen is left with the title and the field, in silence.
 */
export function NowTaskList({ tasks }: { tasks: NowTask[] }) {
  if (tasks.length === 0) return null;

  return (
    <View style={styles.list}>
      {tasks.map((task) => (
        <TaskCard key={task.id} text={task.name} state={cardState(task)} />
      ))}
    </View>
  );
}
