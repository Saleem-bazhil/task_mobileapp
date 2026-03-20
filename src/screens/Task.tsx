import React from "react";
import { Text, View } from "react-native";

const Task = () => {
  return (
    <View className="flex-1 bg-slate-50 px-6 py-8">
      <View className="rounded-3xl bg-amber-100 p-6">
        <Text className="text-2xl font-extrabold text-amber-950">
          Tasks
        </Text>
        <Text className="mt-2 text-base leading-6 text-amber-900">
          Pending work, checklists, and progress cards can be shown here.
        </Text>
      </View>
    </View>
  );
};

export default Task;
