import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../theme/ThemeProvider";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppStack />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function AppStack() {
  const { palette } = useTheme();

  return <Stack screenOptions={{ contentStyle: { backgroundColor: palette.bg } }} />;
}
