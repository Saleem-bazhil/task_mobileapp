import React from "react";
import { Text, View } from "react-native";

const Profile = () => {
  return (
    <View className="flex-1 bg-slate-50 px-6 py-8">
      <View className="rounded-3xl bg-white p-6 shadow-sm">
        <Text className="text-2xl font-extrabold text-slate-900">
          Profile
        </Text>
        <Text className="mt-2 text-base leading-6 text-slate-600">
          Account details, settings, and preferences can be added here.
        </Text>
      </View>
    </View>
  );
};

export default Profile;
