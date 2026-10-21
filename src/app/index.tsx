import { View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

export default function Index() {
  const { palette } = useTheme();

  return <View style={{ flex: 1, backgroundColor: palette.bg }} />;
}
