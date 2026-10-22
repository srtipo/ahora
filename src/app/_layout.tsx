import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../theme/ThemeProvider";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Inter Tight": require("../../assets/fonts/InterTight-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  // Nothing is drawn until the font is ready, otherwise the first paint uses
  // the system font and the text jumps.
  if (!fontsLoaded) return null;

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
