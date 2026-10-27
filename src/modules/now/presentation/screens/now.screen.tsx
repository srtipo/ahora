import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetNowTasks, useGetNowTasksDoneToday } from "@/modules/now/hooks";
import { NowTaskList } from "@/modules/now/presentation/components";
import { TextField } from "@/presentation/fields";
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
  const { data: tasks = [] } = useGetNowTasks();
  const { data: done = [] } = useGetNowTasksDoneToday();
  const [text, setText] = useState("");

  // The completed ones go first and the others after them, in one list:
  // there is no line and nothing that separates them.
  const list = [...done, ...tasks];

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
      </View>

      <ScrollView
        style={styles.root}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <NowTaskList tasks={list} />

        <TextField
          variant="marked"
          value={text}
          placeholder="Anotar algo"
          onChangeText={setText}
          style={styles.field}
        />
      </ScrollView>
    </View>
  );
}
