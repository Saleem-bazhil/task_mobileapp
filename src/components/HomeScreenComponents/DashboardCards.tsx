import { Text, View } from 'react-native';
import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ListTodo,
  PlayCircle,
  TimerReset,
  LucideIcon,
} from 'lucide-react-native';

// 1. TypeScript Interfaces
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

interface StatCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  bgClass: string;
  iconColor: string;
  subtitle: string;
}

// 2. Configuration Array
const CARD_CONFIG = [
  {
    key: 'total',
    title: 'Total Tasks',
    icon: ListTodo,
    bgClass: 'bg-sky-50',
    iconColor: '#0369a1', // text-sky-700
    subtitle: 'All visible tasks',
  },
  {
    key: 'pending',
    title: 'Pending',
    icon: Clock,
    bgClass: 'bg-amber-50',
    iconColor: '#b45309', // text-amber-700
    subtitle: 'Waiting to start',
  },
  {
    key: 'in_progress',
    title: 'In Progress',
    icon: PlayCircle,
    bgClass: 'bg-indigo-50',
    iconColor: '#4338ca', // text-indigo-700
    subtitle: 'Active work now',
  },
  {
    key: 'completed',
    title: 'Completed',
    icon: CheckCircle2,
    bgClass: 'bg-emerald-50',
    iconColor: '#047857', // text-emerald-700
    subtitle: 'Finished tasks',
  },
  {
    key: 'overdue',
    title: 'Overdue',
    icon: AlertTriangle,
    bgClass: 'bg-rose-50',
    iconColor: '#be123c', // text-rose-700
    subtitle: 'Past due date',
  },
  {
    key: 'due_soon',
    title: 'Due Soon',
    icon: TimerReset,
    bgClass: 'bg-orange-50',
    iconColor: '#c2410c', // text-orange-700
    subtitle: 'Next 7 days',
  },
];

// 3. Child Component (Arrow Function)
const StatCard: React.FC<StatCardProps> = ({ title, count, icon: Icon, bgClass, iconColor, subtitle }) => {
  return (
    <View className="mb-4 w-full flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:w-[48%] xl:w-[31%]">
      <View className="mb-5 flex-row items-start justify-between">
        <View>
          <Text className="text-sm font-medium text-slate-500">{title}</Text>
          <Text className="mt-2 text-3xl font-semibold text-slate-900">{count}</Text>
        </View>
        <View className={`rounded-2xl p-3 ${bgClass ?? ''}`}>
          <Icon size={24} color={iconColor} />
        </View>
      </View>
      <Text className="text-sm text-slate-400">{subtitle}</Text>
    </View>
  );
};

// 4. Main Component (Arrow Function)
const DashboardCards: React.FC<DashboardCardsProps> = ({ stats }) => {
  return (
    <View className="flex-row flex-wrap justify-between gap-2 sm:gap-4 xl:gap-5">
      {CARD_CONFIG.map((card) => (
        <StatCard
          key={card.key}
          title={card.title}
          count={stats?.[card.key] ?? 0}
          icon={card.icon}
          bgClass={card.bgClass}
          iconColor={card.iconColor}
          subtitle={card.subtitle}
        />
      ))}
    </View>
  );
};

// 5. Export at the bottom
export default DashboardCards;