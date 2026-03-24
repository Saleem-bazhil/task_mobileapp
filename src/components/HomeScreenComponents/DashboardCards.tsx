import React from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ListTodo,
  LucideIcon,
  PlayCircle,
  Target,
  TimerReset,
  TrendingUp,
} from 'lucide-react-native';

export interface Stats {
  total?: number;
  pending?: number;
  in_progress?: number;
  completed?: number;
  overdue?: number;
  due_soon?: number;
  [key: string]: number | undefined;
}

interface DashboardCardsProps {
  stats?: Stats;
}

interface StatCardConfig {
  key: keyof Stats;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgClass: string;
}

const CARD_CONFIG: StatCardConfig[] = [
  {
    key: 'total',
    title: 'Total Tasks',
    subtitle: 'Everything currently visible',
    icon: ListTodo,
    iconColor: '#E41F6A',
    iconBgClass: 'bg-pink-50',
  },
  {
    key: 'pending',
    title: 'Pending',
    subtitle: 'Waiting to be picked up',
    icon: Clock,
    iconColor: '#D97706',
    iconBgClass: 'bg-amber-50',
  },
  {
    key: 'in_progress',
    title: 'In Progress',
    subtitle: 'Actively being delivered',
    icon: PlayCircle,
    iconColor: '#2563EB',
    iconBgClass: 'bg-blue-50',
  },
  {
    key: 'completed',
    title: 'Completed',
    subtitle: 'Closed successfully',
    icon: CheckCircle2,
    iconColor: '#059669',
    iconBgClass: 'bg-emerald-50',
  },
  {
    key: 'overdue',
    title: 'Overdue',
    subtitle: 'Needs attention right away',
    icon: AlertTriangle,
    iconColor: '#DC2626',
    iconBgClass: 'bg-rose-50',
  },
  {
    key: 'due_soon',
    title: 'Due Soon',
    subtitle: 'Coming up in the next week',
    icon: TimerReset,
    iconColor: '#EA580C',
    iconBgClass: 'bg-orange-50',
  },
];

const DashboardCards: React.FC<DashboardCardsProps> = ({ stats }) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 390;
  const total = stats?.total ?? 0;
  const completed = stats?.completed ?? 0;
  const pending = stats?.pending ?? 0;
  const inProgress = stats?.in_progress ?? 0;
  const overdue = stats?.overdue ?? 0;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const activeCount = pending + inProgress;

  return (
    <View className="rounded-[28px] bg-white p-5 shadow-lg">
      <View className="mb-5 flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-xs font-semibold uppercase tracking-[1.4px] text-pink-700">
            Performance Snapshot
          </Text>
          <Text className="mt-2 text-2xl font-extrabold text-slate-900">Task Stats</Text>
          <Text className="mt-1 text-sm leading-5 text-slate-500">
            Clean visibility into progress, workload, and risk areas.
          </Text>
        </View>
        <View className="rounded-2xl bg-pink-50 p-3">
          <TrendingUp size={22} color="#E41F6A" />
        </View>
      </View>

      {total > 0 ? (
        <View className="mb-5 rounded-[24px] bg-slate-950 px-4 py-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-medium text-white/70">Delivery Momentum</Text>
              <Text className="mt-2 text-3xl font-extrabold text-white">{completionRate}%</Text>
            </View>
            <View className="rounded-2xl bg-white/10 px-3 py-2">
              <Text className="text-xs font-semibold uppercase tracking-[1.4px] text-white/70">
                {activeCount} Active
              </Text>
            </View>
          </View>

          <View className="mt-4 h-2 rounded-full bg-white/10">
            <View
              className="h-2 rounded-full bg-pink-500"
              style={{ width: `${Math.min(completionRate, 100)}%` }}
            />
          </View>

          <View className="mt-4 flex-row justify-between">
            <View>
              <Text className="text-xs uppercase tracking-[1.3px] text-white/50">Completed</Text>
              <Text className="mt-1 text-lg font-bold text-white">{completed}</Text>
            </View>
            <View>
              <Text className="text-xs uppercase tracking-[1.3px] text-white/50">Overdue</Text>
              <Text className="mt-1 text-lg font-bold text-white">{overdue}</Text>
            </View>
            <View>
              <Text className="text-xs uppercase tracking-[1.3px] text-white/50">Open</Text>
              <Text className="mt-1 text-lg font-bold text-white">{activeCount}</Text>
            </View>
          </View>
        </View>
      ) : null}

      <View className="flex-row flex-wrap justify-between">
        {CARD_CONFIG.map((card) => {
          const Icon = card.icon;
          const count = stats?.[card.key] ?? 0;

          return (
            <Pressable
              key={card.key}
              className="mb-4 rounded-[24px] border border-slate-100 bg-slate-50 p-4 active:scale-95"
              style={{ width: isWide ? '48.3%' : '100%' }}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-sm font-semibold text-slate-900">{card.title}</Text>
                  <Text className="mt-1 text-sm leading-5 text-slate-500">{card.subtitle}</Text>
                </View>
                <View className={`h-11 w-11 items-center justify-center rounded-2xl ${card.iconBgClass}`}>
                  <Icon size={20} color={card.iconColor} />
                </View>
              </View>

              <Text className="mt-5 text-3xl font-extrabold text-slate-900">{count}</Text>
            </Pressable>
          );
        })}
      </View>

      {total === 0 ? (
        <View className="mt-2 items-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-5 py-8">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white">
            <Target size={24} color="#CBD5E1" />
          </View>
          <Text className="mt-4 text-lg font-semibold text-slate-700">No tasks yet</Text>
          <Text className="mt-1 text-center text-sm leading-5 text-slate-500">
            Once work starts flowing in, your dashboard metrics will appear here.
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default DashboardCards;
