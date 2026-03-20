import "./global.css";

import { StatusBar, useColorScheme, View, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

function App() {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  return (
    <View className="flex-1 bg-black justify-center items-center">
      <Text className="text-white text-xl font-bold">
        NativeWind Working hello 🚀
      </Text>
    </View>
  );
}

export default App;
