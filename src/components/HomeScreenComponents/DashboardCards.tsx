import React from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import {
  CheckCircle2,
  Clock,
  ListTodo,
  LucideIcon,
  PlayCircle,
  Target,
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
  icon: LucideIcon;
  iconColor: string;
  iconBgClass: string;
  badgeClass: string;
}

const CARD_CONFIG: StatCardConfig[] = [
  {
    key: 'total',
    title: 'Total Tasks',
    icon: ListTodo,
    iconColor: '#E41F6A',
    iconBgClass: 'bg-pink-50',
    badgeClass: 'bg-pink-100',
  },
  {
    key: 'pending',
    title: 'Pending',
    icon: Clock,
    iconColor: '#D97706',
    iconBgClass: 'bg-amber-50',
    badgeClass: 'bg-amber-100',
  },
  {
    key: 'in_progress',
    title: 'In Progress',
    icon: PlayCircle,
    iconColor: '#2563EB',
    iconBgClass: 'bg-blue-50',
    badgeClass: 'bg-blue-100',
  },
  {
    key: 'completed',
    title: 'Completed',
    icon: CheckCircle2,
    iconColor: '#059669',
    iconBgClass: 'bg-emerald-50',
    badgeClass: 'bg-emerald-100',
  },
];

const DashboardCards: React.FC<DashboardCardsProps> = ({ stats }) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 390;
  const total = stats?.total ?? 0;
  const completed = stats?.completed ?? 0;
  const pending = stats?.pending ?? 0;
  const inProgress = stats?.in_progress ?? 0;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const activeCount = pending + inProgress;

  return (
    <View className="rounded-[28px] bg-white p-5 shadow-lg">
      <View className="mb-5 flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-xs font-semibold uppercase tracking-[1.4px] text-pink-700">
            Performance Snapshot
          </Text>
          <Text className="mt-1 text-[23px] font-extrabold tracking-[-0.4px] text-slate-900">
            Task Stats
          </Text>
        </View>
        <View className="items-end">
          <View className="rounded-2xl bg-pink-50 p-3">
            <TrendingUp size={22} color="#E41F6A" />
          </View>
          <View className="mt-2 rounded-full bg-slate-100 px-3 py-1">
            <Text className="text-[11px] font-semibold uppercase tracking-[1.2px] text-slate-500">
              Live
            </Text>
          </View>
        </View>
      </View>

      {total > 0 ? (
        <View className="mb-5 overflow-hidden rounded-[24px] bg-[#3B1F31] px-4 py-4">
          <View className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-pink-400/15" />
          <View className="absolute -bottom-8 -left-4 h-28 w-28 rounded-full bg-white/5" />

          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-[13px] font-medium text-white/70">Completion Rate</Text>
              <Text className="mt-1.5 text-[30px] font-extrabold text-white">{completionRate}%</Text>
            </View>
            <View className="rounded-2xl bg-white/10 px-3 py-2">
              <Text className="text-[11px] font-semibold uppercase tracking-[1.1px] text-white/75">
                {total} Tasks
              </Text>
            </View>
          </View>

          <View className="mt-4 h-2 rounded-full bg-white/12">
            <View
              className="h-2 rounded-full bg-pink-500"
              style={{ width: `${Math.min(completionRate, 100)}%` }}
            />
          </View>

          <View className="mt-4 flex-row justify-between rounded-[18px] bg-white/6 px-3 py-3">
            <View className="items-start">
              <Text className="text-[10px] uppercase tracking-[1.1px] text-white/50">Completed</Text>
              <Text className="mt-1 text-base font-bold text-white">{completed}</Text>
            </View>
            <View className="items-center">
              <Text className="text-[10px] uppercase tracking-[1.1px] text-white/50">Pending</Text>
              <Text className="mt-1 text-base font-bold text-white">{pending}</Text>
            </View>
            <View className="items-end">
              <Text className="text-[10px] uppercase tracking-[1.1px] text-white/50">Open</Text>
              <Text className="mt-1 text-base font-bold text-white">{activeCount}</Text>
            </View>
          </View>
        </View>
      ) : null}

      <View className="flex-row flex-wrap justify-between rounded-[26px] bg-slate-50 p-3">
        {CARD_CONFIG.map((card) => {
          const Icon = card.icon;
          const count = stats?.[card.key] ?? 0;

          return (
            <Pressable
              key={card.key}
              className="mb-3 rounded-[20px] border border-white bg-white px-4 py-3.5 active:bg-slate-50"
              style={{ width: isWide ? '48.3%' : '100%' }}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-[10px] font-semibold uppercase tracking-[1.1px] text-slate-500">
                    {card.title}
                  </Text>
                  <Text className="mt-2.5 text-[28px] font-extrabold leading-none text-slate-900">
                    {count}
                  </Text>
                </View>
                <View
                  className={`h-11 w-11 items-center justify-center rounded-[16px] ${card.iconBgClass}`}
                >
                  <Icon size={18} color={card.iconColor} />
                </View>
              </View>

              <View className="mt-3.5 flex-row items-center justify-between">
                <View className={`rounded-full px-3 py-1.5 ${card.badgeClass}`}>
                  <Text className="text-[10px] font-semibold uppercase tracking-[1px] text-slate-600">
                    {card.title}
                  </Text>
                </View>
                <View className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              </View>
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
