import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetStackTasks } from "@/modules/stack/hooks";
import { StackTaskList } from "@/modules/stack/presentation/components";
import { BackLink } from "@/presentation/buttons";
import { TextField } from "@/presentation/fields";
import { Chevron } from "@/presentation/icons";
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
  const { data: tasks = [], isLoading: loading } = useGetStackTasks();
  const [text, setText] = useState("");

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

      <ScrollView
        style={styles.root}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <TextField
          value={text}
          onChangeText={setText}
          style={styles.field}
        />

        <StackTaskList tasks={tasks} loading={loading} />
      </ScrollView>
    </View>
  );
}
