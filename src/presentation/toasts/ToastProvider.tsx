import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Toast, type ToastKind } from "./Toast";

/** How long the toast stays on screen. */
const DURATION = 2200;

/** How long it takes to come in and to go away. */
const ANIMATION = 180;

/** Where it comes from, above the edge of the screen. */
const OFFSET = -120;

/** The gap between the edge of the screen and the toast. */
const MARGIN = 8;

/** The gap between the toast and the sides of the screen. */
const SIDES = 16;

export type ToastApi = {
  /** Shows a message. */
  show: (message: string, kind?: ToastKind) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  toast: {
    position: "absolute",
    left: SIDES,
    right: SIDES,
    alignItems: "center",
  },
});

/**
 * The toast of the app.
 *
 * It is the only surface that talks to the user: one pill that comes down
 * from the top. It lives in the root of the tree, so it is a plain view and
 * not a native modal: a modal is drawn over the root and would cover it.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<{ message: string; kind: ToastKind } | null>(
    null,
  );

  const progress = useState(() => new Animated.Value(0))[0];
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    Animated.timing(progress, {
      toValue: 0,
      duration: ANIMATION,
      useNativeDriver: true,
    }).start(() => setToast(null));
  }, [progress]);

  const show = useCallback(
    (message: string, kind: ToastKind = "ok") => {
      if (timer.current) clearTimeout(timer.current);

      setToast({ message, kind });
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: ANIMATION,
        useNativeDriver: true,
      }).start();

      timer.current = setTimeout(hide, DURATION);
    },
    [hide, progress],
  );

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const api = useMemo<ToastApi>(() => ({ show }), [show]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [OFFSET, 0],
  });

  return (
    <ToastContext.Provider value={api}>
      <View style={styles.root}>
        {children}
        {toast ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.toast,
              {
                top: insets.top + MARGIN,
                opacity: progress,
                transform: [{ translateY }],
              },
            ]}
          >
            <Toast message={toast.message} kind={toast.kind} />
          </Animated.View>
        ) : null}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}
