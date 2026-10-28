import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useAddStackTask, useGetStackTasks } from "@/modules/stack/hooks";
import { StackTaskList } from "@/modules/stack/presentation/components";
import { BackLink } from "@/presentation/buttons";
import { TextField } from "@/presentation/fields";
import { Chevron } from "@/presentation/icons";
import { useToast } from "@/presentation/toasts";
import { fontFamily, lineHeight, useTheme } from "@/theme";

/** The gap between the sides of the screen and what is on it. */
const SIDE = 24;

/** The gap between the top of the screen and the link that comes back. */
const LINK_TOP = 8;

/** The gap between the link and the title. */
const TITLE_GAP = 25;

/**
 * The gap between the title and the field.
 *
 * It is the space the subtitle left: the title and the field stay where the
 * design puts them.
 */
const FIELD_GAP = 44;

/**
 * The gap between the field and the first task of the list.
 *
 * It is the one the design leaves: the list starts right there.
 */
const LIST_GAP = 32;

/**
 * The height of the fade that dissolves the list.
 *
 * It is the top of the list, under the field: the tasks go through it while
 * the list scrolls and fade away before they reach the field, instead of
 * being cut right at its edge. It is a little lower than the gap the design
 * leaves, so the fade is short and the list is not hidden for long.
 */
const FADE_HEIGHT = 24;

const TITLE_SIZE = 26;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SIDE,
  },
  title: {
    marginTop: TITLE_GAP,
    fontFamily,
    includeFontPadding: false,
  },
  content: {
    paddingHorizontal: SIDE,
  },
  field: {
    marginTop: FIELD_GAP,
    paddingHorizontal: SIDE,
  },
  fade: {
    position: "absolute",
    top: 0,
    left: SIDE,
    right: SIDE,
    height: FADE_HEIGHT,
  },
});

/**
 * Buzón: the tasks of the stack and the field to write in.
 *
 * The tasks are the ones that are stored, the marked one first and the
 * oldest after it. The field is always there, even when there is nothing to
 * do: the empty screen is the title and the field, in silence.
 */
export default function StackScreen() {
  const { palette } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const toast = useToast();
  const { data: tasks = [], isLoading: loading } = useGetStackTasks();
  const { mutate: addTask } = useAddStackTask();
  const [text, setText] = useState("");

  // The field of the stack never marks: what is written here is born
  // unmarked, the other way around than the one of now.
  const onSubmit = () => {
    const name = text.trim();

    if (!name) return;

    addTask(
      { name, marked: false },
      {
        onSuccess: () => {
          setText("");
          toast.show("Anotada");
        },
        onError: () => {
          toast.show("No se pudo guardar. Probá de nuevo.", "error");
        },
      },
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: palette.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + LINK_TOP }]}>
        <BackLink text="Ahora" icon={Chevron} onPress={() => router.back()} />

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
          Buzón
        </Text>
      </View>

      <View style={styles.field}>
        <TextField
          value={text}
          placeholder="Anotar algo"
          onChangeText={setText}
          onSubmit={onSubmit}
        />
      </View>

      <View style={styles.root}>
        <ScrollView
          style={styles.root}
          contentContainerStyle={[
            styles.content,
            {
              paddingTop: LIST_GAP,
              paddingBottom: insets.bottom + 24,
            },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <StackTaskList tasks={tasks} loading={loading} />
        </ScrollView>

        <LinearGradient
          colors={[palette.bg, palette.bgFade]}
          style={styles.fade}
          pointerEvents="none"
        />
      </View>
    </View>
  );
}
