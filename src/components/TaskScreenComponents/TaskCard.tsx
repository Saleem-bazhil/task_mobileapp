import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock3,
  Play,
  Sparkles,
} from 'lucide-react-native';

export interface Task {
  id: string | number;
  title: string;
  description: string;
  priority?: 'high' | 'medium' | 'low' | string;
  status?: 'pending' | 'in_progress' | 'completed' | string;
  due_date?: string | Date;
}

export interface TaskCardProps {
  task: Task;
  isAccepted?: boolean;
  isCompleted?: boolean;
  onAccept?: () => void;
  onStart?: () => void;
  onComplete?: () => void;
}

const priorityStyles: Record<string, { chip: string; text: string }> = {
  high: { chip: 'bg-rose-50', text: 'text-rose-700' },
  medium: { chip: 'bg-amber-50', text: 'text-amber-700' },
  low: { chip: 'bg-emerald-50', text: 'text-emerald-700' },
};

const statusStyles: Record<string, { chip: string; text: string }> = {
  completed: { chip: 'bg-emerald-100', text: 'text-emerald-700' },
  in_progress: { chip: 'bg-blue-100', text: 'text-blue-700' },
  pending: { chip: 'bg-amber-100', text: 'text-amber-700' },
};

const formatLabel = (value?: string) => {
  if (!value) return 'Unknown';
  if (value === 'in_progress') return 'In Progress';
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
};

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isAccepted = false,
  isCompleted = false,
  onAccept,
  onStart,
  onComplete,
}) => {
  if (!task) return null;

  const priority = task.priority || 'medium';
  const status = task.status || 'pending';
  const priorityStyle = priorityStyles[priority.toLowerCase()] ?? {
    chip: 'bg-slate-100',
    text: 'text-slate-700',
  };
  const statusStyle = statusStyles[status.toLowerCase()] ?? {
    chip: 'bg-slate-100',
    text: 'text-slate-700',
  };
  const progressTone = isCompleted ? '#059669' : isAccepted ? '#2563EB' : '#D97706';

  const handleView = () => {
    Alert.alert(task.title, task.description || 'No description provided yet.');
  };

  return (
    <View className="mb-4 overflow-hidden rounded-[28px] bg-white shadow-lg">
      <View style={{ height: 6, backgroundColor: progressTone }} />

      <View className="p-5">
        <View className="mb-4 flex-row items-start justify-between">
          <View className={`rounded-full px-3 py-1 ${priorityStyle.chip}`}>
            <Text className={`text-xs font-semibold ${priorityStyle.text}`}>
              {formatLabel(priority)} Priority
            </Text>
          </View>
          <View className={`rounded-full px-3 py-1 ${statusStyle.chip}`}>
            <Text className={`text-xs font-semibold ${statusStyle.text}`}>{formatLabel(status)}</Text>
          </View>
        </View>

        <Text className="text-xl font-extrabold leading-7 text-slate-900">{task.title}</Text>
        <Text className="mt-2 text-sm leading-6 text-slate-500" numberOfLines={3}>
          {task.description || 'No description provided yet.'}
        </Text>

        <View className="mt-5 rounded-[22px] bg-slate-50 px-4 py-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Calendar size={16} color="#94A3B8" />
              <Text className="ml-2 text-sm font-medium text-slate-600">
                {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Clock3 size={14} color={progressTone} />
              <Text className="ml-1 text-sm font-semibold" style={{ color: progressTone }}>
                {isCompleted ? 'Completed' : isAccepted ? 'In Progress' : 'Assigned'}
              </Text>
            </View>
          </View>

          <View className="mt-3 flex-row items-center">
            <Sparkles size={14} color="#E41F6A" />
            <Text className="ml-1 text-sm font-medium text-pink-700">
              Clean progress tracking with quick actions
            </Text>
          </View>
        </View>

        <View className="mt-5 flex-row gap-3">
          <Pressable
            onPress={handleView}
            className="flex-1 flex-row items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 active:scale-95"
          >
            <ArrowRight size={16} color="#0F172A" />
            <Text className="ml-2 text-sm font-semibold text-slate-900">View</Text>
          </Pressable>

          {!isAccepted && !isCompleted ? (
            <Pressable
              onPress={onAccept}
              className="flex-1 flex-row items-center justify-center rounded-2xl bg-pink-600 px-4 py-3 active:scale-95"
            >
              <CheckCircle2 size={16} color="#FFFFFF" />
              <Text className="ml-2 text-sm font-semibold text-white">Update Status</Text>
            </Pressable>
          ) : null}

          {isAccepted && !isCompleted ? (
            <Pressable
              onPress={onComplete ?? onStart}
              className="flex-1 flex-row items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 active:scale-95"
            >
              <Play size={16} color="#FFFFFF" />
              <Text className="ml-2 text-sm font-semibold text-white">Update Status</Text>
            </Pressable>
          ) : null}

          {isCompleted ? (
            <View className="flex-1 flex-row items-center justify-center rounded-2xl bg-slate-100 px-4 py-3">
              <CheckCircle2 size={16} color="#64748B" />
              <Text className="ml-2 text-sm font-semibold text-slate-500">Completed</Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default TaskCard;
