import React from 'react';
import { Text, View } from 'react-native';
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  LucideIcon,
  UserPlus2,
} from 'lucide-react-native';

export type ActionType = 'completed' | 'in_progress' | 'assigned' | string;

export interface Activity {
  id: string | number;
  action: ActionType;
  title: string;
  detail: string;
  timestamp: string | number | Date;
  assigned_to?: {
    username?: string;
  };
}

interface ActivityTimelineProps {
  activities?: Activity[];
}

const activityConfig = (
  action: ActionType
): { icon: LucideIcon; container: string; iconColor: string; label: string } => {
  switch (action) {
    case 'completed':
      return {
        icon: CheckCircle2,
        container: 'bg-emerald-50',
        iconColor: '#059669',
        label: 'Completed',
      };
    case 'in_progress':
      return {
        icon: Clock3,
        container: 'bg-pink-50',
        iconColor: '#E41F6A',
        label: 'In Progress',
      };
    case 'assigned':
      return {
        icon: UserPlus2,
        container: 'bg-blue-50',
        iconColor: '#2563EB',
        label: 'Assigned',
      };
    default:
      return {
        icon: AlertTriangle,
        container: 'bg-slate-100',
        iconColor: '#475569',
        label: 'Update',
      };
  }
};

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities = [] }) => {
  return (
    <View className="rounded-[28px] bg-white p-5 shadow-lg">
      <View className="mb-5">
        <Text className="text-xs font-semibold uppercase tracking-[1.4px] text-pink-700">
          Recent Updates
        </Text>
        <Text className="mt-2 text-2xl font-extrabold text-slate-900">Activity Feed</Text>
        <Text className="mt-1 text-sm leading-5 text-slate-500">
          A clear stream of movement across the work happening in your space.
        </Text>
      </View>

      {activities.length === 0 ? (
        <View className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-5 py-9">
          <Text className="text-center text-sm leading-6 text-slate-500">
            Activity updates will appear here once work starts changing.
          </Text>
        </View>
      ) : (
        <View className="gap-4">
          {activities.slice(0, 4).map((activity, index) => {
            const config = activityConfig(activity.action);
            const Icon = config.icon;
            const isLast = index === Math.min(activities.length, 4) - 1;

            return (
              <View key={`${activity.action}-${activity.id}`} className="flex-row">
                <View className="mr-4 items-center">
                  <View className={`h-11 w-11 items-center justify-center rounded-2xl ${config.container}`}>
                    <Icon size={18} color={config.iconColor} />
                  </View>
                  {!isLast ? <View className="mt-2 w-px flex-1 bg-slate-200" /> : null}
                </View>

                <View className="flex-1 rounded-[24px] border border-slate-100 bg-slate-50 p-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="flex-1 pr-3 text-base font-semibold text-slate-900">
                      {activity.title}
                    </Text>
                    <View className={`rounded-full px-3 py-1 ${config.container}`}>
                      <Text className="text-xs font-semibold text-slate-700">{config.label}</Text>
                    </View>
                  </View>

                  <Text className="mt-2 text-sm leading-6 text-slate-500">{activity.detail}</Text>

                  <View className="mt-4 flex-row items-center justify-between">
                    <Text className="text-xs font-semibold uppercase tracking-[1.3px] text-slate-400">
                      {activity.assigned_to?.username ?? 'Unassigned'}
                    </Text>
                    <Text className="text-xs font-medium text-slate-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default ActivityTimeline;
