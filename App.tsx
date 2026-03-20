import "./global.css";

import { StatusBar, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import BottomTabs from "./src/navigation/BottomTabs";

function App() {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <BottomTabs />
    </SafeAreaProvider>
  );
}

export default App;
