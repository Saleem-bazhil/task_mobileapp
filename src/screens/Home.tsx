import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Menu,
  PlayCircle,
  Sparkles,
  X,
} from 'lucide-react-native';

import ActivityTimeline from '../components/HomeScreenComponents/ActivityTimeline';
import DashboardCards from '../components/HomeScreenComponents/DashboardCards';
import RecentTasks from '../components/HomeScreenComponents/RecentTasks';
import { useAuth } from '../context/useAuth';
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

type SectionKey = 'overview' | 'stats' | 'recent' | 'activity';

const BRAND_PINK = '#E41F6A';
const BRAND_PINK_DARK = '#C41E5E';

const Home = () => {
  const { user } = useAuth();
  const scrollRef = useRef<ScrollView | null>(null);
  const sectionOffsets = useRef<Record<SectionKey, number>>({
    overview: 0,
    stats: 0,
    recent: 0,
    activity: 0,
  });

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const quickTaskCards = useMemo(
    () => [
      {
        key: 'my-tasks',
        title: 'My Tasks',
        count: dashboard?.stats?.pending ?? 0,
        subtitle: 'Ready for your next move',
        icon: ClipboardList,
        iconColor: BRAND_PINK,
        bgClass: 'bg-pink-50',
      },
      {
        key: 'accepted',
        title: 'Accepted',
        count: dashboard?.stats?.in_progress ?? 0,
        subtitle: 'Currently in motion',
        icon: PlayCircle,
        iconColor: '#2563EB',
        bgClass: 'bg-blue-50',
      },
      {
        key: 'completed',
        title: 'Completed',
        count: dashboard?.stats?.completed ?? 0,
        subtitle: 'Delivered successfully',
        icon: CheckCircle2,
        iconColor: '#059669',
        bgClass: 'bg-emerald-50',
      },
    ],
    [dashboard?.stats?.completed, dashboard?.stats?.in_progress, dashboard?.stats?.pending]
  );

  const drawerItems: Array<{
    key: SectionKey;
    title: string;
    subtitle: string;
  }> = [
    { key: 'overview', title: 'Overview', subtitle: 'Hero and quick task summary' },
    { key: 'stats', title: 'Stats', subtitle: 'Counts, progress, and delivery health' },
    { key: 'recent', title: 'Recent Tasks', subtitle: 'Latest assignments and due dates' },
    { key: 'activity', title: 'Activity', subtitle: 'Workspace movement and updates' },
  ];

  const registerSection = (key: SectionKey, y: number) => {
    sectionOffsets.current[key] = y;
  };

  const jumpToSection = (key: SectionKey) => {
    scrollRef.current?.scrollTo({
      y: Math.max(sectionOffsets.current[key] - 16, 0),
      animated: true,
    });
    setIsDrawerOpen(false);
  };

  return (
    <View className="flex-1 bg-[#FFF6FA]">
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-5 flex-row items-center justify-between">
          <Pressable
            onPress={() => setIsDrawerOpen(true)}
            className="h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white shadow-md active:scale-95"
          >
            <Menu size={20} color="#1F2937" />
          </Pressable>

          <View className="flex-1 px-4">
            <Text className="text-[13px] font-medium text-slate-500">Workspace Dashboard</Text>
            <View className="mt-1 flex-row items-center">
              <View className="mr-2 h-8 w-8 items-center justify-center rounded-2xl bg-pink-100">
                <Sparkles size={16} color={BRAND_PINK} />
              </View>
              <Text className="text-xl font-extrabold text-slate-900">Renderways</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3">
            <Pressable className="h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white shadow-md active:scale-95">
              <View className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-pink-500" />
              <Bell size={19} color="#334155" />
            </Pressable>
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#1F2937] shadow-md">
              <Text className="text-base font-bold text-white">{avatarLetter}</Text>
            </View>
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

            <View className="flex-row gap-3">
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
                <Text className="mt-2 text-2xl font-extrabold text-white">
                  {dashboard?.stats?.due_soon ?? 0}
                </Text>
              </View>
            </View>

            <View className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-white/10" />
            <View className="pointer-events-none absolute -bottom-10 right-10 h-24 w-24 rounded-full bg-[#FF6B9D]/30" />
          </View>

          <View className="px-5 py-5">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-slate-900">Task Spaces</Text>
              <Text className="text-sm font-medium text-pink-700">Tap cards to explore</Text>
            </View>

            <View className="gap-3">
              {quickTaskCards.map((card) => {
                const Icon = card.icon;

                return (
                  <Pressable
                    key={card.key}
                    className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 active:scale-95"
                  >
                    <View className="flex-row items-center">
                      <View className={`mr-4 h-12 w-12 items-center justify-center rounded-2xl ${card.bgClass}`}>
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

            <View onLayout={(event) => registerSection('recent', event.nativeEvent.layout.y)}>
              <RecentTasks tasks={dashboard?.recent_tasks} isAdmin={isAdmin} />
            </View>

            <View onLayout={(event) => registerSection('activity', event.nativeEvent.layout.y)}>
              <ActivityTimeline activities={dashboard?.activities} />
            </View>
          </View>
        )}
      </ScrollView>

      {isDrawerOpen ? (
        <View className="absolute inset-0 flex-row">
          <Pressable className="flex-1 bg-slate-900/30" onPress={() => setIsDrawerOpen(false)} />
          <View className="w-[84%] max-w-[320px] bg-white px-5 pb-8 pt-6 shadow-2xl">
            <View className="mb-6 flex-row items-center justify-between">
              <View>
                <Text className="text-xs font-semibold uppercase tracking-[1.4px] text-pink-700">
                  Quick Navigation
                </Text>
                <Text className="mt-1 text-2xl font-extrabold text-slate-900">Dashboard Menu</Text>
              </View>
              <Pressable
                onPress={() => setIsDrawerOpen(false)}
                className="h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 active:scale-95"
              >
                <X size={18} color="#334155" />
              </Pressable>
            </View>

            <View className="mb-6 rounded-[24px] bg-pink-50 p-4">
              <Text className="text-sm font-semibold text-pink-700">Today&apos;s Focus</Text>
              <Text className="mt-2 text-3xl font-extrabold text-slate-900">
                {(dashboard?.stats?.pending ?? 0) + (dashboard?.stats?.in_progress ?? 0)}
              </Text>
              <Text className="mt-1 text-sm leading-5 text-slate-500">
                Active and pending items waiting for attention.
              </Text>
            </View>

            <View className="gap-3">
              {drawerItems.map((item) => (
                <Pressable
                  key={item.key}
                  onPress={() => jumpToSection(item.key)}
                  className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 active:scale-95"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 pr-3">
                      <Text className="text-base font-semibold text-slate-900">{item.title}</Text>
                      <Text className="mt-1 text-sm leading-5 text-slate-500">{item.subtitle}</Text>
                    </View>
                    <ChevronRight size={18} color={BRAND_PINK_DARK} />
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default Home;
