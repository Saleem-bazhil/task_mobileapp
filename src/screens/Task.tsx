import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { Briefcase, CheckCircle, ChevronRight, ListTodo, Sparkles } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { TaskStackParamList } from '../navigation/TaskStack';
import { fetchDashboard } from '../services/tasks';

type TaskDashboardNavigationProp = NativeStackNavigationProp<TaskStackParamList, 'TaskDashboard'>;

interface DashboardData {
  stats?: {
    total?: number;
    pending?: number;
    in_progress?: number;
    completed?: number;
  };
}

interface TaskHubContentProps {
  navigation: TaskDashboardNavigationProp;
}

const TaskHubContent: React.FC<TaskHubContentProps> = ({ navigation }) => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setIsLoading(true);

      try {
        const response = await fetchDashboard();

        if (!cancelled) {
          setDashboard(response);
          setError('');
        }
      } catch {
        if (!cancelled) {
          setError('Unable to load task hub counts right now.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const pendingCount = dashboard?.stats?.pending ?? 0;
  const inProgressCount = dashboard?.stats?.in_progress ?? 0;
  const completedCount = dashboard?.stats?.completed ?? 0;
  const openCount = pendingCount + inProgressCount;

  const cardItems = useMemo(
    () => [
      {
        key: 'MyTasks' as const,
        title: 'Assigned Tasks',
        subtitle: 'New assignments waiting for action',
        count: pendingCount,
        accent: 'bg-pink-50',
        iconColor: '#E41F6A',
        icon: ListTodo,
      },
      {
        key: 'AcceptedTasks' as const,
        title: 'In Progress',
        subtitle: 'Work currently in progress',
        count: inProgressCount,
        accent: 'bg-blue-50',
        iconColor: '#2563EB',
        icon: Briefcase,
      },
      {
        key: 'CompletedTasks' as const,
        title: 'Completed',
        subtitle: 'Finished and archived deliverables',
        count: completedCount,
        accent: 'bg-emerald-50',
        iconColor: '#059669',
        icon: CheckCircle,
      },
    ],
    [completedCount, inProgressCount, pendingCount]
  );

  return (
    <ScrollView
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-5 overflow-hidden rounded-[28px] bg-white">
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
          <View className="mr-2 flex-1 rounded-2xl bg-slate-50 px-4 py-3">
            <Text className="text-xs font-semibold uppercase tracking-[1.3px] text-slate-400">Open</Text>
            <Text className="mt-2 text-2xl font-extrabold text-slate-900">{openCount}</Text>
          </View>
          <View className="ml-2 flex-1 rounded-2xl bg-slate-50 px-4 py-3">
            <Text className="text-xs font-semibold uppercase tracking-[1.3px] text-slate-400">
              Completed
            </Text>
            <Text className="mt-2 text-2xl font-extrabold text-slate-900">{completedCount}</Text>
          </View>
        </View>
      </View>

      {error ? (
        <View className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
          <Text className="text-sm font-medium text-rose-700">{error}</Text>
        </View>
      ) : null}

      <Text className="mb-4 ml-1 text-xs font-semibold uppercase tracking-[1.4px] text-pink-700">
        Collections
      </Text>

      {isLoading ? (
        <View className="rounded-[28px] bg-white px-6 py-12">
          <View className="items-center">
            <ActivityIndicator size="large" color="#E41F6A" />
            <Text className="mt-4 text-sm text-slate-500">Loading task hub...</Text>
          </View>
        </View>
      ) : (
        <View className="gap-4">
          {cardItems.map((item) => {
            const Icon = item.icon;

            return (
              <Pressable
                key={item.key}
                onPress={() => navigation.navigate(item.key)}
                className="rounded-[28px] bg-white p-5 active:scale-95"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 flex-row items-center pr-3">
                    <View
                      className={`mr-4 h-14 w-14 items-center justify-center rounded-2xl ${item.accent}`}
                    >
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
      )}
    </ScrollView>
  );
};

const TaskDashboard: React.FC = () => {
  const navigation = useNavigation<TaskDashboardNavigationProp>();

  return (
    <View className="flex-1 bg-[#FFF6FA]">
      <StatusBar barStyle="dark-content" backgroundColor="#FFF6FA" />
      <TaskHubContent navigation={navigation} />
    </View>
  );
};

export default TaskDashboard;
