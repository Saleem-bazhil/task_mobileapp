import React from 'react';
import { Text, View } from 'react-native';
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
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

const configFor = (action: ActionType) => {
  switch (action) {
    case 'completed':
      return {
        icon: CheckCircle2,
        bgClass: 'border-emerald-100 bg-emerald-50',
        iconColor: '#047857',
      };
    case 'in_progress':
      return {
        icon: Clock3,
        bgClass: 'border-pink-100 bg-pink-50',
        iconColor: '#E41F6A',
      };
    case 'assigned':
      return {
        icon: UserPlus2,
        bgClass: 'border-pink-100 bg-pink-50',
        iconColor: '#E41F6A',
      };
    default:
      return {
        icon: AlertTriangle,
        bgClass: 'border-slate-100 bg-slate-50',
        iconColor: '#334155',
      };
  }
};

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities = [] }) => {
  return (
    <View className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <View className="mb-6">
        <Text className="text-xl font-semibold text-slate-900">Activity Timeline</Text>
        <Text className="mt-1 text-sm text-slate-500">
          Latest task movement in your workspace.
        </Text>
      </View>

      {activities.length === 0 ? (
        <View className="rounded-2xl bg-slate-50 p-4">
          <Text className="text-sm text-slate-500">No recent activity yet.</Text>
        </View>
      ) : (
        <View className="border-l border-slate-200">
          {activities.map((activity, index) => {
            const { icon: Icon, bgClass, iconColor } = configFor(activity.action);
            const isLast = index === activities.length - 1;

            return (
              <View
                key={`${activity.action}-${activity.id}`}
                className={`relative pl-7 ${isLast ? '' : 'pb-6'}`}
              >
                <View className="absolute -left-[18px] top-0 rounded-full bg-white p-1">
                  <View className={`rounded-full border p-1.5 ${bgClass}`}>
                    <Icon size={16} color={iconColor} />
                  </View>
                </View>

                <View className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <Text className="text-sm font-semibold text-slate-900">
                    {activity.title}
                  </Text>
                  <Text className="mt-1 text-sm text-slate-500">
                    {activity.detail}
                  </Text>
                  <Text className="mt-2 text-xs uppercase tracking-widest text-slate-400">
                    {activity.assigned_to?.username ?? 'Unassigned'}
                  </Text>
                  <Text className="mt-3 text-xs text-slate-400">
                    {new Date(activity.timestamp).toLocaleString()}
                  </Text>
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
