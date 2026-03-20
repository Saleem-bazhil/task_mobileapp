import React from "react";
import { Text, View } from "react-native";

const Chat = () => {
  return (
    <View className="flex-1 bg-slate-50 px-6 py-8">
      <View className="rounded-3xl bg-white p-6 shadow-sm">
        <Text className="text-2xl font-extrabold text-slate-900">
          Chat inbox
        </Text>
        <Text className="mt-2 text-base leading-6 text-slate-600">
          Conversations, support, or team updates can be surfaced in this tab.
        </Text>
      </View>
    </View>
  );
};

export default Chat;
