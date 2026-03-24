import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Circle,
  ClipboardList,
  MessageCircleMore,
  PlayCircle,
  Sparkles,
  X,
} from 'lucide-react-native';

import ActivityTimeline from '../components/HomeScreenComponents/ActivityTimeline';
import DashboardCards from '../components/HomeScreenComponents/DashboardCards';
import { useAuth } from '../context/useAuth';
import { useBottomTabs } from '../navigation/BottomTabs';
import { fetchDashboard } from '../services/tasks';

interface DashboardData {
  viewer_role?: string;
  stats?: {
    total?: number;
    pending?: number;
    in_progress?: number;
    completed?: number;
    overdue?: number;
    due_soon?: number;
  };
  recent_tasks?: any[];
  activities?: any[];
}

type SectionKey = 'overview' | 'stats' | 'activity';

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  tone: 'pink' | 'blue' | 'emerald';
};

const BRAND_PINK = '#E41F6A';
const DASHBOARD_LOGO = require('../assets/logo.png');

const notificationTone = {
  pink: { bg: 'bg-pink-50', icon: '#E41F6A' },
  blue: { bg: 'bg-blue-50', icon: '#2563EB' },
  emerald: { bg: 'bg-emerald-50', icon: '#059669' },
};

const taskRouteMap = {
  assigned: 'MyTasks',
  progress: 'AcceptedTasks',
  completed: 'CompletedTasks',
} as const;

const HomeContent = () => {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const { setActiveTab, chatBadgeCount, setPendingTaskRoute } = useBottomTabs();
  const scrollRef = useRef<ScrollView | null>(null);
  const sectionOffsets = useRef<Record<SectionKey, number>>({
    overview: 0,
    stats: 0,
    activity: 0,
  });

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

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
          setError('Unable to load the dashboard right now.');
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

  const isAdmin = dashboard?.viewer_role === 'admin';
  const userLabel = user?.username || 'User';
  const avatarLetter = userLabel.charAt(0).toUpperCase() || 'U';
  const pendingCount = dashboard?.stats?.pending ?? 0;
  const inProgressCount = dashboard?.stats?.in_progress ?? 0;
  const completedCount = dashboard?.stats?.completed ?? 0;
  const dueSoonCount = dashboard?.stats?.due_soon ?? 0;
  const isCompact = width < 380;

  const notifications = useMemo<NotificationItem[]>(
    () => [
      {
        id: 'assigned',
        title: `${pendingCount} assigned tasks waiting`,
        body: 'Review the newest work and move the right items into progress.',
        tone: 'pink',
      },
      {
        id: 'due-soon',
        title: `${dueSoonCount} items due soon`,
        body: 'A quick check-in today will help prevent deadline pressure later.',
        tone: 'blue',
      },
      {
        id: 'completed',
        title: `${completedCount} completed this cycle`,
        body: 'Recent deliveries are closing out well and keeping momentum visible.',
        tone: 'emerald',
      },
    ],
    [completedCount, dueSoonCount, pendingCount]
  );

  const notificationCount = notifications.filter((item) => !item.title.startsWith('0 ')).length;

  const quickTaskCards = useMemo(
    () => [
      {
        key: 'assigned',
        title: 'Assigned Tasks',
        count: pendingCount,
        subtitle: 'Ready for your next move',
        icon: ClipboardList,
        iconColor: BRAND_PINK,
        bgClass: 'bg-pink-50',
      },
      {
        key: 'progress',
        title: 'In Progress',
        count: inProgressCount,
        subtitle: 'Currently in motion',
        icon: PlayCircle,
        iconColor: '#2563EB',
        bgClass: 'bg-blue-50',
      },
      {
        key: 'completed',
        title: 'Completed',
        count: completedCount,
        subtitle: 'Delivered successfully',
        icon: CheckCircle2,
        iconColor: '#059669',
        bgClass: 'bg-emerald-50',
      },
    ],
    [completedCount, inProgressCount, pendingCount]
  );

  const registerSection = (key: SectionKey, y: number) => {
    sectionOffsets.current[key] = y;
  };

  return (
    <View className="flex-1 bg-[#FFF6FA]">
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-5 flex-row items-center justify-between">
          <View className="flex-1 pr-4">
            <Text className="text-[13px] font-medium text-slate-500">Workspace Dashboard</Text>
            <View className="mt-1 flex-row items-center">
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Image source={DASHBOARD_LOGO} className="h-7 w-7" resizeMode="contain" />
              </View>
              <Text className="text-xl font-extrabold text-slate-900">Renderways</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => setActiveTab('Chat')}
              className="h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white shadow-md active:scale-95"
            >
              {chatBadgeCount > 0 ? (
                <View className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-pink-600 px-1.5 py-0.5">
                  <Text className="text-center text-[10px] font-bold text-white">
                    {chatBadgeCount > 99 ? '99+' : chatBadgeCount}
                  </Text>
                </View>
              ) : null}
              <MessageCircleMore size={19} color="#334155" />
            </Pressable>

            <Pressable
              onPress={() => setIsNotificationOpen(true)}
              className="h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white shadow-md active:scale-95"
            >
              {notificationCount > 0 ? (
                <View className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-slate-900 px-1.5 py-0.5">
                  <Text className="text-center text-[10px] font-bold text-white">
                    {notificationCount}
                  </Text>
                </View>
              ) : null}
              <Bell size={19} color="#334155" />
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('Profile')}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-[#1F2937] shadow-md active:bg-slate-800"
            >
              <Text className="text-base font-bold text-white">{avatarLetter}</Text>
            </Pressable>
          </View>
        </View>

        <View
          onLayout={(event) => registerSection('overview', event.nativeEvent.layout.y)}
          className="mb-5 overflow-hidden rounded-[28px] bg-white shadow-lg"
        >
          <View className="bg-[#E41F6A] px-5 pb-6 pt-5">
            <View className="mb-5 flex-row items-start justify-between">
              <View className="flex-1 pr-4">
                <View className="self-start rounded-full bg-white/20 px-3 py-1">
                  <Text className="text-xs font-semibold uppercase tracking-[1.4px] text-white">
                    {isAdmin ? 'Admin View' : 'Personal Hub'}
                  </Text>
                </View>
                <Text className="mt-4 text-3xl font-extrabold leading-9 text-white">
                  Welcome back, {userLabel}
                </Text>
                <Text className="mt-3 text-sm leading-6 text-white/85">
                  {isAdmin
                    ? 'Monitor task flow, assignment load, and team momentum from one polished control center.'
                    : 'Stay on top of your work, deadlines, and recent updates without leaving the dashboard.'}
                </Text>
              </View>

              <View className="rounded-[22px] bg-white/15 px-3 py-3">
                <Sparkles size={24} color="#FFFFFF" />
              </View>
            </View>

            <View className={isCompact ? 'gap-3' : 'flex-row gap-3'}>
              <View className="flex-1 rounded-2xl bg-white/14 px-4 py-3">
                <Text className="text-xs font-medium uppercase tracking-[1.3px] text-white/75">
                  Total Tasks
                </Text>
                <Text className="mt-2 text-2xl font-extrabold text-white">
                  {dashboard?.stats?.total ?? 0}
                </Text>
              </View>
              <View className="flex-1 rounded-2xl bg-white/14 px-4 py-3">
                <Text className="text-xs font-medium uppercase tracking-[1.3px] text-white/75">
                  Due Soon
                </Text>
                <Text className="mt-2 text-2xl font-extrabold text-white">{dueSoonCount}</Text>
              </View>
            </View>

            <View className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-white/10" />
            <View className="pointer-events-none absolute -bottom-10 right-10 h-24 w-24 rounded-full bg-[#FF6B9D]/30" />
          </View>

          <View className="px-5 py-5">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-slate-900">Task Spaces</Text>
              <Pressable
                onPress={() => setActiveTab('Chat')}
                className="rounded-full bg-pink-50 px-3 py-2 active:scale-95"
              >
                <Text className="text-sm font-semibold text-pink-700">Quick Chat</Text>
              </Pressable>
            </View>

            <View className="gap-3">
              {quickTaskCards.map((card) => {
                const Icon = card.icon;

                return (
                  <Pressable
                    key={card.key}
                    onPress={() => {
                      setPendingTaskRoute(taskRouteMap[card.key as keyof typeof taskRouteMap]);
                      setActiveTab('Tasks');
                    }}
                    className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 active:scale-95"
                  >
                    <View className="flex-row items-center">
                      <View
                        className={`mr-4 h-12 w-12 items-center justify-center rounded-2xl ${card.bgClass}`}
                      >
                        <Icon size={22} color={card.iconColor} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-slate-900">{card.title}</Text>
                        <Text className="mt-1 text-sm text-slate-500">{card.subtitle}</Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-2xl font-extrabold text-slate-900">{card.count}</Text>
                        <ChevronRight size={16} color="#94A3B8" />
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {error ? (
          <View className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
            <Text className="text-sm font-medium text-rose-700">{error}</Text>
          </View>
        ) : null}

        {isLoading ? (
          <View className="items-center justify-center rounded-[28px] bg-white px-6 py-14 shadow-lg">
            <ActivityIndicator size="large" color={BRAND_PINK} />
            <Text className="mt-4 text-sm text-slate-500">Loading dashboard...</Text>
          </View>
        ) : (
          <View className="gap-5">
            <View onLayout={(event) => registerSection('stats', event.nativeEvent.layout.y)}>
              <DashboardCards stats={dashboard?.stats} />
            </View>

            <View onLayout={(event) => registerSection('activity', event.nativeEvent.layout.y)}>
              <ActivityTimeline activities={dashboard?.activities} />
            </View>
          </View>
        )}
      </ScrollView>

      <Pressable
        onPress={() => setActiveTab('Chat')}
        className="absolute bottom-6 right-5 flex-row items-center rounded-full bg-pink-600 px-5 py-4 shadow-2xl active:scale-95"
      >
        <MessageCircleMore size={18} color="#FFFFFF" />
        <Text className="ml-2 text-sm font-semibold text-white">Quick Chat</Text>
        {chatBadgeCount > 0 ? (
          <View className="ml-3 rounded-full bg-white/20 px-2 py-0.5">
            <Text className="text-xs font-bold text-white">{chatBadgeCount}</Text>
          </View>
        ) : null}
      </Pressable>

      <Modal
        visible={isNotificationOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setIsNotificationOpen(false)}
      >
        <Pressable
          className="flex-1 bg-slate-900/35 px-5 py-12"
          onPress={() => setIsNotificationOpen(false)}
        >
          <Pressable className="mt-10 rounded-[28px] bg-white p-5 shadow-2xl active:scale-100">
            <View className="mb-5 flex-row items-center justify-between">
              <View>
                <Text className="text-xs font-semibold uppercase tracking-[1.4px] text-pink-700">
                  Notifications
                </Text>
                <Text className="mt-1 text-2xl font-extrabold text-slate-900">Updates</Text>
              </View>
              <Pressable
                onPress={() => setIsNotificationOpen(false)}
                className="h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 active:scale-95"
              >
                <X size={18} color="#334155" />
              </Pressable>
            </View>

            <View className="gap-3">
              {notifications.map((item) => {
                const tone = notificationTone[item.tone];

                return (
                  <View
                    key={item.id}
                    className={`rounded-[24px] border border-slate-100 ${tone.bg} px-4 py-4`}
                  >
                    <View className="flex-row items-start">
                      <View className="mr-3 mt-1">
                        <Circle size={10} fill={tone.icon} color={tone.icon} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-slate-900">{item.title}</Text>
                        <Text className="mt-1 text-sm leading-5 text-slate-600">{item.body}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const Home = () => <HomeContent />;

export default Home;
