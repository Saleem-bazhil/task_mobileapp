import React from 'react';
import { Text, View } from 'react-native';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ListTodo,
  LucideIcon,
  PlayCircle,
  TimerReset,
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

interface StatCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  iconColor: string;
  iconBgClass: string;
  subtitle: string;
}

const CARD_CONFIG = [
  {
    key: 'total',
    title: 'Total Tasks',
    icon: ListTodo,
    iconBgClass: 'bg-pink-50',
    iconColor: '#E41F6A',
    subtitle: 'All visible tasks',
  },
  {
    key: 'pending',
    title: 'Pending',
    icon: Clock,
    iconBgClass: 'bg-amber-50',
    iconColor: '#b45309',
    subtitle: 'Waiting to start',
  },
  {
    key: 'in_progress',
    title: 'In Progress',
    icon: PlayCircle,
    iconBgClass: 'bg-pink-50',
    iconColor: '#E41F6A',
    subtitle: 'Active work now',
  },
  {
    key: 'completed',
    title: 'Completed',
    icon: CheckCircle2,
    iconBgClass: 'bg-emerald-50',
    iconColor: '#047857',
    subtitle: 'Finished tasks',
  },
  {
    key: 'overdue',
    title: 'Overdue',
    icon: AlertTriangle,
    iconBgClass: 'bg-rose-50',
    iconColor: '#be123c',
    subtitle: 'Past due date',
  },
  {
    key: 'due_soon',
    title: 'Due Soon',
    icon: TimerReset,
    iconBgClass: 'bg-orange-50',
    iconColor: '#c2410c',
    subtitle: 'Next 7 days',
  },
] as const;

const StatCard: React.FC<StatCardProps> = ({
  title,
  count,
  icon: Icon,
  iconColor,
  iconBgClass,
  subtitle,
}) => {
  return (
    <View className="mb-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-sm font-medium text-slate-500">{title}</Text>
          <Text className="mt-2 text-3xl font-semibold text-slate-900">{count}</Text>
          <Text className="mt-2 text-sm text-slate-400">{subtitle}</Text>
        </View>

        <View className={`rounded-2xl p-3 ${iconBgClass}`}>
          <Icon size={24} color={iconColor} />
        </View>
      </View>
    </View>
  );
};

const DashboardCards: React.FC<DashboardCardsProps> = ({ stats }) => {
  return (
    <View>
      {CARD_CONFIG.map((card) => (
        <StatCard
          key={card.key}
          title={card.title}
          count={stats?.[card.key] ?? 0}
          icon={card.icon}
          iconBgClass={card.iconBgClass}
          iconColor={card.iconColor}
          subtitle={card.subtitle}
        />
      ))}
    </View>
  );
};

export default DashboardCards;
