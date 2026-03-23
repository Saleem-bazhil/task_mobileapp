import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
// Import from the React Native specific lucide package
import { AlertTriangle, CheckCircle2, Clock3, UserPlus2 } from 'lucide-react-native';

// 1. Define the possible actions for better strict typing
export type ActionType = 'completed' | 'in_progress' | 'assigned' | string;

// 2. Define the shape of a single activity object
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

// 3. Define the props for the component
interface ActivityTimelineProps {
  activities?: Activity[];
}

// Extracted hex colors so lucide-react-native can reliably color the SVGs
const configFor = (action: ActionType) => {
  switch (action) {
    case 'completed':
      return {
        icon: CheckCircle2,
        bgClass: 'border-emerald-100 bg-emerald-50',
        iconColor: '#047857', // text-emerald-700
      };
    case 'in_progress':
      return {
        icon: Clock3,
        bgClass: 'border-indigo-100 bg-indigo-50',
        iconColor: '#4338ca', // text-indigo-700
      };
    case 'assigned':
      return {
        icon: UserPlus2,
        bgClass: 'border-sky-100 bg-sky-50',
        iconColor: '#0369a1', // text-sky-700
      };
    default:
      return {
        icon: AlertTriangle,
        bgClass: 'border-slate-100 bg-slate-50',
        iconColor: '#334155', // text-slate-700
      };
  }
};

// 4. Apply the types to the functional component
const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities = [] }) => {
  return (
    <View className="min-h-[420px] rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <View className="mb-6">
        <Text className="text-xl font-semibold text-slate-900">Activity Timeline</Text>
        <Text className="mt-1 text-sm text-slate-500">Latest task movement in your workspace.</Text>
      </View>

      {activities.length === 0 ? (
        <View className="rounded-2xl bg-slate-50 p-4">
          <Text className="text-sm text-slate-500">No recent activity yet.</Text>
        </View>
      ) : (
        // flex-col and gap-6 replace web's space-y-6 for better React Native support
        <View className="relative ml-3 flex-col gap-6 border-l border-slate-200">
          {activities.map((activity) => {
            const { icon: Icon, bgClass, iconColor } = configFor(activity.action);

            return (
              <View key={`${activity.action}-${activity.id}`} className="relative pl-7">

                {/* Timeline Dot (Recreates the 'ring-4 ring-white' effect) */}
                <View className="absolute -left-[18px] top-0 rounded-full bg-white p-1">
                  <View className={`rounded-full border p-1.5 ${bgClass ?? ''}`}>
                    <Icon size={16} color={iconColor} />
                  </View>
                </View>

                {/* Activity Card */}
                <View className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  {/* Explicit flex-row needed for React Native */}
                  <View className="flex-row items-start justify-between gap-3">

                    {/* Added flex-1 so long text wraps instead of pushing the date off-screen */}
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-slate-900">
                        {activity.title}
                      </Text>
                      <Text className="mt-1 text-sm text-slate-500">
                        {activity.detail}
                      </Text>
                      <Text className="mt-2 text-xs uppercase tracking-widest text-slate-400">
                        {activity.assigned_to?.username ?? 'Unassigned'}
                      </Text>
                    </View>

                    <Text className="shrink-0 text-xs text-slate-400">
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
