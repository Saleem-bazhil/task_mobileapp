import React from 'react';
import { ScrollView, StatusBar, Text, View, Pressable } from 'react-native';
import { Briefcase, CheckCircle, ChevronRight, ListTodo, Sparkles } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { TaskStackParamList } from '../navigation/TaskStack';

type TaskDashboardNavigationProp = NativeStackNavigationProp<TaskStackParamList, 'TaskDashboard'>;

const CARD_ITEMS = [
  {
    key: 'MyTasks',
    title: 'Assigned Tasks',
    subtitle: 'New assignments waiting for action',
    count: '12',
    accent: 'bg-pink-50',
    iconColor: '#E41F6A',
    icon: ListTodo,
  },
  {
    key: 'AcceptedTasks',
    title: 'In Progress',
    subtitle: 'Work currently in progress',
    count: '5',
    accent: 'bg-blue-50',
    iconColor: '#2563EB',
    icon: Briefcase,
  },
  {
    key: 'CompletedTasks',
    title: 'Completed',
    subtitle: 'Finished and archived deliverables',
    count: '48',
    accent: 'bg-emerald-50',
    iconColor: '#059669',
    icon: CheckCircle,
  },
] as const;

const TaskDashboard: React.FC = () => {
  const navigation = useNavigation<TaskDashboardNavigationProp>();

  return (
    <View className="flex-1 bg-[#FFF6FA]">
      <StatusBar barStyle="dark-content" backgroundColor="#FFF6FA" />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-5 overflow-hidden rounded-[28px] bg-white shadow-lg">
          <View className="bg-[#E41F6A] px-5 pb-6 pt-5">
            <View className="mb-4 flex-row items-center justify-between">
              <View className="rounded-full bg-white/15 px-3 py-1">
                <Text className="text-xs font-semibold uppercase tracking-[1.4px] text-white">
                  Task Hub
                </Text>
              </View>
              <Sparkles size={20} color="#FFFFFF" />
            </View>
            <Text className="text-3xl font-extrabold leading-9 text-white">Your task workspace</Text>
            <Text className="mt-3 text-sm leading-6 text-white/85">
              Move through incoming work, active delivery, and completed output with a cleaner mobile flow.
            </Text>
          </View>

          <View className="flex-row justify-between px-5 py-5">
            <View className="flex-1 rounded-2xl bg-slate-50 px-4 py-3 mr-2">
              <Text className="text-xs font-semibold uppercase tracking-[1.3px] text-slate-400">Open</Text>
              <Text className="mt-2 text-2xl font-extrabold text-slate-900">17</Text>
            </View>
            <View className="flex-1 rounded-2xl bg-slate-50 px-4 py-3 ml-2">
              <Text className="text-xs font-semibold uppercase tracking-[1.3px] text-slate-400">Completed</Text>
              <Text className="mt-2 text-2xl font-extrabold text-slate-900">48</Text>
            </View>
          </View>
        </View>

        <Text className="mb-4 ml-1 text-xs font-semibold uppercase tracking-[1.4px] text-pink-700">
          Collections
        </Text>

        <View className="gap-4">
          {CARD_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <Pressable
                key={item.key}
                onPress={() => navigation.navigate(item.key)}
                className="rounded-[28px] bg-white p-5 shadow-lg active:scale-95"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1 pr-3">
                    <View className={`mr-4 h-14 w-14 items-center justify-center rounded-2xl ${item.accent}`}>
                      <Icon size={24} color={item.iconColor} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xl font-extrabold text-slate-900">{item.title}</Text>
                      <Text className="mt-1 text-sm leading-5 text-slate-500">{item.subtitle}</Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text className="text-2xl font-extrabold text-slate-900">{item.count}</Text>
                    <ChevronRight size={18} color="#94A3B8" />
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default TaskDashboard;
