import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ArrowRight, CalendarDays, FolderKanban } from 'lucide-react-native';

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
    id?: string | number;
    username?: string;
  };
  assigned_to?: {
    id?: string | number;
    username?: string;
  };
  assigned_by?: {
    id?: string | number;
    username?: string;
  };
  owner?: {
    id?: string | number;
    username?: string;
  };
  created_by?: {
    id?: string | number;
    username?: string;
  };
  creator?: {
    id?: string | number;
    username?: string;
  };
}

interface RecentTasksProps {
  tasks?: Task[];
  isAdmin?: boolean;
  onViewAll?: () => void;
}

const priorityStyles: Record<string, { container: string; text: string }> = {
  high: { container: 'bg-rose-50', text: 'text-rose-700' },
  medium: { container: 'bg-amber-50', text: 'text-amber-700' },
  low: { container: 'bg-emerald-50', text: 'text-emerald-700' },
};

const statusStyles: Record<string, { container: string; text: string }> = {
  completed: { container: 'bg-emerald-100', text: 'text-emerald-700' },
  in_progress: { container: 'bg-pink-100', text: 'text-pink-700' },
  pending: { container: 'bg-amber-100', text: 'text-amber-700' },
};

const formatStatus = (status?: string) => {
  if (!status) {
    return 'Unknown';
  }

  if (status === 'in_progress') {
    return 'In Progress';
  }

  return `${status.charAt(0).toUpperCase()}${status.slice(1)}`;
};

const RecentTasks: React.FC<RecentTasksProps> = ({ tasks = [], isAdmin, onViewAll }) => {
  return (
    <View className="rounded-[28px] bg-white p-5 shadow-lg">
      <View className="mb-5 flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-xs font-semibold uppercase tracking-[1.4px] text-pink-700">
            Latest Queue
          </Text>
          <Text className="mt-2 text-2xl font-extrabold text-slate-900">Recent Tasks</Text>
          <Text className="mt-1 text-sm leading-5 text-slate-500">
            {isAdmin
              ? 'Keep an eye on the newest assignments and handoffs across the workspace.'
              : 'Review the latest changes across the work currently connected to you.'}
          </Text>
        </View>

        <Pressable
          onPress={onViewAll}
          className="h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 active:scale-95"
        >
          <ArrowRight size={18} color="#E41F6A" />
        </Pressable>
      </View>

      {tasks.length === 0 ? (
        <View className="items-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-5 py-9">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white">
            <FolderKanban size={24} color="#CBD5E1" />
          </View>
          <Text className="mt-4 text-lg font-semibold text-slate-700">No recent tasks</Text>
          <Text className="mt-1 text-center text-sm leading-5 text-slate-500">
            New assignments and updates will appear here as soon as they come in.
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {tasks.slice(0, 3).map((task) => {
            const priority = priorityStyles[task.priority] ?? {
              container: 'bg-slate-100',
              text: 'text-slate-700',
            };
            const status = statusStyles[task.status] ?? {
              container: 'bg-slate-100',
              text: 'text-slate-700',
            };

            return (
              <Pressable
                key={task.id}
                className="rounded-[24px] border border-slate-100 bg-slate-50 p-4 active:scale-95"
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="text-base font-semibold text-slate-900">{task.title}</Text>
                    <Text className="mt-1 text-sm leading-5 text-slate-500" numberOfLines={2}>
                      {task.description || 'No description added yet.'}
                    </Text>
                  </View>

                  <View className="items-end">
                    <View className={`rounded-full px-3 py-1 ${priority.container}`}>
                      <Text className={`text-xs font-semibold capitalize ${priority.text}`}>
                        {task.priority}
                      </Text>
                    </View>
                    <View className={`mt-2 rounded-full px-3 py-1 ${status.container}`}>
                      <Text className={`text-xs font-semibold ${status.text}`}>
                        {formatStatus(task.status)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="mt-4 border-t border-slate-200 pt-3">
                  <View className="self-end rounded-2xl bg-white px-3 py-2">
                    <View className="flex-row items-center">
                      <CalendarDays size={14} color="#94A3B8" />
                      <Text className="ml-2 text-sm font-medium text-slate-600">
                        {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'TBD'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="mt-3">
                  <Pressable className="flex-1 flex-row items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 active:scale-95">
                    <ArrowRight size={15} color="#0F172A" />
                    <Text className="ml-2 text-sm font-semibold text-slate-900">View</Text>
                  </Pressable>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default RecentTasks;
