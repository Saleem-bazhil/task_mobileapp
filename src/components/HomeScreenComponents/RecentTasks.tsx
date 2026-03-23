import { Text, View, Pressable } from 'react-native';
import React from 'react';
// Use the React Native specific Lucide package
import { ArrowRight, CalendarDays } from 'lucide-react-native';

// 1. Strict TypeScript Interfaces
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
  onViewAll?: () => void; // Replaces the react-router <Link>
}

// 2. Helper functions adapted for NativeWind
// Separated bg/border from text to ensure <Text> components reliably pick up the color
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

// 3. Main Component (rnfe format)
const RecentTasks: React.FC<RecentTasksProps> = ({ tasks = [], isAdmin, onViewAll }) => {
  return (
    <View className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      
      {/* Header Area */}
      <View className="flex-row items-center justify-between border-b border-slate-200 p-5">
        <View className="flex-1 pr-4">
          <Text className="text-xl font-semibold text-slate-900">Recent Tasks</Text>
          <Text className="mt-1 text-sm text-slate-500">
            {isAdmin ? 'Latest assignments across the workspace.' : 'Latest updates on your assigned work.'}
          </Text>
        </View>
        
        {/* Replaced web <Link> with <Pressable> */}
        <Pressable 
          onPress={onViewAll} 
          className="flex-row items-center gap-1 active:opacity-70"
        >
          <Text className="text-sm font-medium text-sky-700">View All</Text>
          <ArrowRight size={16} color="#0369a1" /> {/* text-sky-700 */}
        </Pressable>
      </View>

      {/* Content Area */}
      {tasks.length === 0 ? (
        <View className="p-6">
          <Text className="text-sm text-slate-500">No task activity yet.</Text>
        </View>
      ) : (
        <View className="flex-col">
          {tasks.map((task, index) => {
            const priorityStyle = getPriorityClasses(task.priority);
            const statusStyle = getStatusClasses(task.status);
            // Hide bottom border for the last item
            const isLast = index === tasks.length - 1;

            return (
              // Replaced table row with a Mobile Card layout
              <View 
                key={task.id} 
                className={`p-5 ${!isLast && 'border-b border-slate-100'}`}
              >
                {/* Top Half: Title & Badges */}
                <View className="flex-row items-start justify-between gap-3">
                  <View className="flex-1">
                    <Text className="text-base font-medium text-slate-900">
                      {task.title}
                    </Text>
                    {/* numberOfLines replaces CSS line-clamp */}
                    <Text className="mt-1 text-sm text-slate-500" numberOfLines={1}>
                      {task.description || 'No description added.'}
                    </Text>
                  </View>

                  {/* Badges Column */}
                  <View className="items-end gap-2">
                    <View className={`rounded-full border px-2.5 py-1 ${priorityStyle.bg}`}>
                      <Text className={`text-xs font-semibold capitalize ${priorityStyle.text}`}>
                        {task.priority}
                      </Text>
                    </View>
                    <View className={`rounded-full px-2.5 py-1 ${statusStyle.bg}`}>
                      <Text className={`text-xs font-medium ${statusStyle.text}`}>
                        {formatStatus(task.status)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Bottom Half: Footer Info */}
                <View className="mt-4 flex-row items-center justify-between border-t border-slate-50 pt-3">
                  <Text className="text-sm font-medium text-slate-700">
                    {isAdmin ? 'Assigned to: ' : 'Owner: '}
                    <Text className="font-semibold">{task.user?.username || 'Unassigned'}</Text>
                  </Text>
                  
                  <View className="flex-row items-center gap-1.5">
                    <CalendarDays size={14} color="#94a3b8" /> {/* text-slate-400 */}
                    <Text className="text-sm text-slate-600">
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