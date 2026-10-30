import type { StyleProp, ViewStyle } from "react-native";
import { useCompleteNowTask } from "@/modules/clock/hooks";
import { Button } from "@/presentation/buttons";
import { Check } from "@/presentation/icons";
import { useToast } from "@/presentation/toasts";

export type DoneButtonProps = {
  /** The id of the task that the block is about. */
  taskId: string;
  /**
   * Action when the task is done.
   *
   * The button does not decide what happens next: it tells, and the screen
   * does the rest.
   */
  onDone?: () => void;
  /** Layout tweaks: the screen owns the place of the button. */
  style?: StyleProp<ViewStyle>;
};

/**
 * The button that makes the task of the block done.
 *
 * It says "Hecho" with the check mark, and it is the only way to complete a
 * task: in Ahora there is no button (#19).
 *
 * While the write is going it shows the spinner and does not take another
 * tap: the task is completed once, and the tap that does nothing is the one
 * that confuses.
 */
export function DoneButton({ taskId, onDone, style }: DoneButtonProps) {
  const toast = useToast();
  const { mutate, isPending } = useCompleteNowTask();

  return (
    <Button
      text="Hecho"
      icon={Check}
      state={isPending ? "loading" : "default"}
      disabled={isPending}
      onPress={() =>
        mutate(taskId, {
          onSuccess: onDone,
          onError: () =>
            toast.show("No se pudo guardar. Probá de nuevo.", "error"),
        })
      }
      style={style}
    />
  );
}
