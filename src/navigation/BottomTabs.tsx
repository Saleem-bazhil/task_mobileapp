import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import Chat from "../screens/Chat";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import Task from "../screens/Task";

type TabKey = "Home" | "Chat" | "Tasks" | "Profile";

type TabConfig = {
  key: TabKey;
  label: string;
  activeIcon: string;
  inactiveIcon: string;
  component: React.ComponentType;
};

const PRIMARY_COLOR = "#0f766e";
const INACTIVE_COLOR = "#94a3b8";
const styles = StyleSheet.create({
  activeIconBubble: {
    backgroundColor: "rgba(15, 118, 110, 0.12)",
  },
  iconGlyph: {
    fontSize: 20,
  },
  inactiveIconBubble: {
    backgroundColor: "transparent",
  },
});

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
    activeIcon: "⌂",
    inactiveIcon: "○",
    component: Home,
  },
  {
    key: "Chat",
    label: "Chat",
    activeIcon: "◔",
    inactiveIcon: "◌",
    component: Chat,
  },
  {
    key: "Tasks",
    label: "Tasks",
    activeIcon: "✓",
    inactiveIcon: "◯",
    component: Task,
  },
  {
    key: "Profile",
    label: "Profile",
    activeIcon: "●",
    inactiveIcon: "○",
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
          className="border-t border-slate-200 bg-white px-3 pt-2"
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
                  className="flex-1 items-center rounded-2xl py-2"
                  onPress={() => setActiveTab(tab.key)}
                >
                  <View
                    className="mb-1 rounded-full px-4 py-2"
                    style={
                      focused
                        ? styles.activeIconBubble
                        : styles.inactiveIconBubble
                    }
                  >
                    <Text
                      style={[
                        styles.iconGlyph,
                        { color: focused ? PRIMARY_COLOR : INACTIVE_COLOR },
                      ]}
                    >
                      {focused ? tab.activeIcon : tab.inactiveIcon}
                    </Text>
                  </View>
                  <Text
                    className="text-xs font-semibold"
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
