import React from "react";
import { Text, View } from "react-native";

const Home = () => {
  return (
    <View className="flex-1 bg-slate-50 px-6 py-8">
      <View className="rounded-3xl bg-teal-700 p-6">
        <Text className="text-sm font-semibold uppercase tracking-[2px] text-teal-100">
          Today
        </Text>
        <Text className="mt-3 text-3xl font-extrabold text-white">
          Welcome back
        </Text>
        <Text className="mt-2 text-base text-teal-50">
          Your shortcuts, updates, and activity can live here.
        </Text>
      </View>
    </View>
  );
};

export default Home;
