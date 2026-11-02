import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NowTask } from "@/core";
import {
  useAddNowTask,
  useGetNowTasks,
  useGetNowTasksDoneToday,
  useMarkNowTask,
  useMoveNowTaskToStack,
} from "@/modules/now/hooks";
import { NowTaskList } from "@/modules/now/presentation/components";
import { PillButton } from "@/presentation/buttons";
import { TextField } from "@/presentation/fields";
import { Tray } from "@/presentation/icons";
import { useToast } from "@/presentation/toasts";
import { fontFamily, lineHeight, useTheme } from "@/theme";

/** The gap between the sides of the screen and what is on it. */
const SIDE = 24;

/** The gap between the top of the screen and the header. */
const TOP = 4;

/** The gap between the blocks: the title, the list and the field. */
const BLOCK_GAP = 28;

const TITLE_SIZE = 26;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SIDE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontFamily,
    includeFontPadding: false,
  },
  content: {
    paddingHorizontal: SIDE,
  },
  field: {
    marginTop: BLOCK_GAP,
  },
});

/**
 * Ahora: the tasks of now and the field to write in.
 *
 * The tasks are the ones that are stored: the ones completed today first and
 * the others after them, with no separation between them. The field is
 * always there, even when there is nothing to do: the empty screen is the
 * title and the field, in silence.
 */
export default function NowScreen() {
  const { palette } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const toast = useToast();
  const { data: tasks = [], isLoading: loadingTasks } = useGetNowTasks();
  const { data: done = [], isLoading: loadingDone } = useGetNowTasksDoneToday();
  const { mutate: addTask } = useAddNowTask();
  const { mutate: markTask } = useMarkNowTask();
  const { mutate: moveTask } = useMoveNowTaskToStack();
  const [text, setText] = useState("");

  // The completed ones go first and the others after them, in one list:
  // there is no line and nothing that separates them.
  const list = [...done, ...tasks];

  // The field of now always marks: what is written here is born marked.
  const onSubmit = () => {
    const name = text.trim();

    if (!name) return;

    addTask(
      { name, marked: true },
      {
        onSuccess: () => {
          setText("");
          toast.show("Anotada");
        },
        onError: () => {
          toast.show("No se pudo guardar. Intente nuevamente.", "error");
        },
      },
    );
  };

  // Tapping a card does not start the clock: it takes you to the block
  // screen, and there is where the clock starts. The id of the task goes in
  // the route, because the block is about that task.
  const openBlock = (task: NowTask) => {
    router.push({ pathname: "/clock", params: { task: task.id } });
  };

  // Holding a card down is the mark: the task becomes the priority one, and
  // holding it again takes the mark away. The marked card says it with its
  // color, so the toast is only there to say what happened.
  const mark = (task: NowTask) => {
    markTask(task.id, {
      onSuccess: () => toast.show(task.marked ? "Tarea desmarcada" : "Tarea marcada"),
      onError: () => toast.show("No se pudo guardar. Intente nuevamente.", "error"),
    });
  };

  // Dragging a card to the right is "sacar de hoy": the task goes back to the
  // inbox and the place it leaves free is taken by the task that has been
  // waiting the longest. The card only drags and tells: the move is done by
  // the core, which is the one that knows what it means.
  const moveToStack = (task: NowTask) => {
    moveTask(task.id, {
      onSuccess: () => toast.show("Devuelta al buzón"),
      onError: () => toast.show("No se pudo guardar. Intente nuevamente.", "error"),
    });
  };

  return (
    <View style={[styles.root, { backgroundColor: palette.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + TOP }]}>
        <Text
          style={[
            styles.title,
            {
              fontSize: TITLE_SIZE,
              lineHeight: lineHeight(TITLE_SIZE),
              color: palette.text,
            },
          ]}
        >
          Ahora
        </Text>

        <PillButton
          text="Buzón"
          icon={Tray}
          onPress={() => router.push("/buzon")}
        />
      </View>

      <ScrollView
        style={styles.root}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <NowTaskList
          tasks={list}
          loading={loadingTasks || loadingDone}
          tray={Tray}
          onPressTask={openBlock}
          onLongPressTask={mark}
          onSwipeOutTask={moveToStack}
        />

        <TextField
          variant="marked"
          value={text}
          placeholder="Anotar algo"
          onChangeText={setText}
          onSubmit={onSubmit}
          style={styles.field}
        />
      </ScrollView>
    </View>
  );
}
