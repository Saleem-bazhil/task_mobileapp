import React, { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
// 1. Updated import for React Native CLI
import { Home as HomeIcon, MessageCircle, CheckSquare, User } from "lucide-react-native";

import ChatStack from "../navigation/ChatStack";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import TaskStack from "./TaskStack";

type TabKey = "Home" | "Chat" | "Tasks" | "Profile";

type TabConfig = {
  key: TabKey;
  label: string;
  // 2. Simplified type for RN CLI compatibility
  iconName: string;
  component: React.ComponentType;
};

const PRIMARY_COLOR = "#E41F6A";
const INACTIVE_COLOR = "#94a3b8";

const HEADER_TITLES: Record<TabKey, string> = {
  Home: "Dashboard",
  Chat: "Messages",
  Tasks: "Tasks",
  Profile: "Profile",
};

const TABS: TabConfig[] = [
  {
    key: "Home",
    label: "Home",
    iconName: "home",
    component: Home,
  },
  {
    key: "Chat",
    label: "Chat",
    iconName: "message-circle",
    component: ChatStack,
  },
  {
    key: "Tasks",
    label: "Tasks",
    iconName: "check-square",
    component: TaskStack,
  },
  {
    key: "Profile",
    label: "Profile",
    iconName: "user",
    component: Profile,
  },
];

export default function BottomTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>("Home");
  const insets = useSafeAreaInsets();

  const ActiveScreen = useMemo(() => {
    return TABS.find(tab => tab.key === activeTab)?.component ?? Home;
  }, [activeTab]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <View className="flex-1 bg-slate-50">
        <View className="border-b border-slate-200 bg-white px-6 py-4">
          <Text className="text-center text-lg font-extrabold tracking-wide text-slate-900">
            {HEADER_TITLES[activeTab]}
          </Text>
        </View>

        <View className="flex-1">
          <ActiveScreen />
        </View>

        <View
          className="border-t border-slate-200 bg-white px-3 pt-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
          style={{ paddingBottom: Math.max(insets.bottom, 10) }}
        >
          <View className="flex-row">
            {TABS.map(tab => {
              const focused = tab.key === activeTab;

              return (
                <Pressable
                  key={tab.key}
                  accessibilityRole="button"
                  accessibilityState={{ selected: focused }}
                  className="flex-1 items-center py-2"
                  onPress={() => setActiveTab(tab.key)}
                >
                  <View className="mb-1">
                    {tab.key === 'Home' && <HomeIcon size={24} color={focused ? PRIMARY_COLOR : INACTIVE_COLOR} />}
                    {tab.key === 'Chat' && <MessageCircle size={24} color={focused ? PRIMARY_COLOR : INACTIVE_COLOR} />}
                    {tab.key === 'Tasks' && <CheckSquare size={24} color={focused ? PRIMARY_COLOR : INACTIVE_COLOR} />}
                    {tab.key === 'Profile' && <User size={24} color={focused ? PRIMARY_COLOR : INACTIVE_COLOR} />}
                  </View>
                  <Text
                    className="text-xs font-semibold mt-1"
                    style={{ color: focused ? PRIMARY_COLOR : INACTIVE_COLOR }}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
