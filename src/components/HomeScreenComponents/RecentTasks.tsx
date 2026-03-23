import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ArrowRight, CalendarDays } from 'lucide-react-native';

export type Priority = 'high' | 'medium' | 'low' | string;
export type Status = 'completed' | 'in_progress' | 'pending' | string;

export interface Task {
  id: string | number;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  due_date?: string | Date;
  user?: {
    username?: string;
  };
}

interface RecentTasksProps {
  tasks?: Task[];
  isAdmin?: boolean;
  onViewAll?: () => void;
}

const getPriorityClasses = (priority: Priority) => {
  switch (priority) {
    case 'high':
      return { bg: 'border-rose-200 bg-rose-50', text: 'text-rose-700' };
    case 'medium':
      return { bg: 'border-amber-200 bg-amber-50', text: 'text-amber-700' };
    case 'low':
      return { bg: 'border-emerald-200 bg-emerald-50', text: 'text-emerald-700' };
    default:
      return { bg: 'border-slate-200 bg-slate-50', text: 'text-slate-700' };
  }
};

const getStatusClasses = (status: Status) => {
  switch (status) {
    case 'completed':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
    case 'in_progress':
      return { bg: 'bg-indigo-100', text: 'text-indigo-700' };
    case 'pending':
      return { bg: 'bg-amber-100', text: 'text-amber-700' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-700' };
  }
};

const formatStatus = (status?: string) => {
  if (!status) return 'Unknown';
  return status === 'in_progress'
    ? 'In Progress'
    : `${status.charAt(0).toUpperCase()}${status.slice(1)}`;
};

const RecentTasks: React.FC<RecentTasksProps> = ({
  tasks = [],
  isAdmin,
  onViewAll,
}) => {
  return (
    <View className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <View className="flex-row items-center justify-between border-b border-slate-200 p-5">
        <View className="flex-1 pr-4">
          <Text className="text-xl font-semibold text-slate-900">Recent Tasks</Text>
          <Text className="mt-1 text-sm text-slate-500">
            {isAdmin
              ? 'Latest assignments across the workspace.'
              : 'Latest updates on your assigned work.'}
          </Text>
        </View>

        <Pressable
          onPress={onViewAll}
          className="flex-row items-center"
        >
          <Text className="mr-1 text-sm font-medium text-sky-700">View All</Text>
          <ArrowRight size={16} color="#0369a1" />
        </Pressable>
      </View>

      {tasks.length === 0 ? (
        <View className="p-6">
          <Text className="text-sm text-slate-500">No task activity yet.</Text>
        </View>
      ) : (
        <View>
          {tasks.map((task, index) => {
            const priorityStyle = getPriorityClasses(task.priority);
            const statusStyle = getStatusClasses(task.status);
            const isLast = index === tasks.length - 1;

            return (
              <View
                key={task.id}
                className={`p-5 ${isLast ? '' : 'border-b border-slate-100'}`}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="text-base font-medium text-slate-900">
                      {task.title}
                    </Text>
                    <Text className="mt-1 text-sm text-slate-500" numberOfLines={1}>
                      {task.description || 'No description added.'}
                    </Text>
                  </View>

                  <View className="items-end">
                    <View className={`rounded-full border px-2.5 py-1 ${priorityStyle.bg}`}>
                      <Text className={`text-xs font-semibold capitalize ${priorityStyle.text}`}>
                        {task.priority}
                      </Text>
                    </View>
                    <View className={`mt-2 rounded-full px-2.5 py-1 ${statusStyle.bg}`}>
                      <Text className={`text-xs font-medium ${statusStyle.text}`}>
                        {formatStatus(task.status)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="mt-4 flex-row items-center justify-between border-t border-slate-50 pt-3">
                  <Text className="flex-1 pr-3 text-sm font-medium text-slate-700">
                    {isAdmin ? 'Assigned to: ' : 'Owner: '}
                    <Text className="font-semibold">{task.user?.username || 'Unassigned'}</Text>
                  </Text>

                  <View className="flex-row items-center">
                    <CalendarDays size={14} color="#94a3b8" />
                    <Text className="ml-1 text-sm text-slate-600">
                      {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'TBD'}
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

export default RecentTasks;
