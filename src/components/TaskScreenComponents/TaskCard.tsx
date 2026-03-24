import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
// Make sure to: npm install lucide-react-native react-native-svg
import { Calendar, CheckCircle2, Play } from 'lucide-react-native';

// 1. Define the Task Type
export interface Task {
  id: string | number;
  title: string;
  description: string;
  priority?: 'high' | 'medium' | 'low' | string;
  status?: 'pending' | 'in_progress' | 'completed' | string;
  due_date?: string | Date;
}

// 2. Define the Component Props
export interface TaskCardProps {
  task: Task;
  isAccepted?: boolean;
  isCompleted?: boolean;
  onAccept?: () => void;
  onStart?: () => void;
  onComplete?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  isAccepted = false, 
  isCompleted = false, 
  onAccept, 
  onStart, 
  onComplete 
}) => {
  if (!task) return null;

  // Grab values from backend or fallback to defaults
  const priority = task.priority || 'medium';
  const status = task.status || 'pending';

  // Format strings for clean UI display
  const displayPriority = priority.charAt(0).toUpperCase() + priority.slice(1);
  const displayStatus = status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1);

  // 3. Split styles for View (background/border) and Text (color)
  const getPriorityStyles = (prio: string) => {
    switch (prio.toLowerCase()) {
      case 'high': return { view: 'bg-rose-100 border-rose-200', text: 'text-rose-700' };
      case 'medium': return { view: 'bg-amber-100 border-amber-200', text: 'text-amber-700' };
      case 'low': return { view: 'bg-emerald-100 border-emerald-200', text: 'text-emerald-700' };
      default: return { view: 'bg-gray-100 border-gray-200', text: 'text-gray-700' };
    }
  };

  const getStatusStyles = (stat: string) => {
    switch(stat.toLowerCase()) {
      case 'completed': return { view: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' };
      case 'in_progress': return { view: 'bg-pink-50 border-pink-200', text: 'text-pink-700' };
      case 'pending': return { view: 'bg-amber-50 border-amber-200', text: 'text-amber-700' };
      default: return { view: 'bg-gray-50 border-gray-200', text: 'text-gray-700' };
    }
  };

  const priorityStyles = getPriorityStyles(priority);
  const statusStyles = getStatusStyles(status);

  return (
    <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-col mb-4">
      
      {/* Top Section */}
      <View className="flex-row justify-between items-start mb-4">
        <View className={`px-2.5 py-1 rounded-md border ${priorityStyles.view}`}>
          <Text className={`text-xs font-semibold ${priorityStyles.text}`}>
            {displayPriority} Priority
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="mb-4">
        <Text className="text-lg font-bold text-gray-800 leading-tight mb-2">
          {task.title}
        </Text>
        {/* React Native uses numberOfLines instead of line-clamp */}
        <Text className="text-sm text-gray-500 leading-relaxed" numberOfLines={2}>
          {task.description}
        </Text>
      </View>

      {/* Footer Details */}
      <View className="mt-auto">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Calendar color="#6b7280" size={16} />
            <Text className="text-gray-500 text-sm ml-1.5">
              Due: <Text className="text-gray-700 font-medium">
                {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'TBD'}
              </Text>
            </Text>
          </View>
          
          <View className={`px-2.5 py-1 rounded-full border ${statusStyles.view}`}>
            <Text className={`text-xs font-medium ${statusStyles.text}`}>
              {displayStatus}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-2 pt-4 border-t border-gray-100">
          
          {!isAccepted && !isCompleted && (
            <TouchableOpacity 
              onPress={onAccept} 
              activeOpacity={0.8}
              className="flex-1 bg-pink-600 py-2.5 rounded-xl shadow-sm flex-row justify-center items-center gap-1.5"
            >
              <CheckCircle2 color="#ffffff" size={16} />
              <Text className="text-white text-sm font-medium">Accept Task</Text>
            </TouchableOpacity>
          )}

          {isAccepted && !isCompleted && (
            <>
              <TouchableOpacity 
                onPress={onStart} 
                activeOpacity={0.8}
                className="flex-1 bg-white border border-pink-200 py-2.5 rounded-xl flex-row justify-center items-center gap-1.5"
              >
                <Play color="#E41F6A" size={16} />
                <Text className="text-pink-700 text-sm font-medium">Start</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={onComplete} 
                activeOpacity={0.8}
                className="flex-1 bg-emerald-600 py-2.5 rounded-xl shadow-sm flex-row justify-center items-center gap-1.5"
              >
                <CheckCircle2 color="#ffffff" size={16} />
                <Text className="text-white text-sm font-medium">Complete</Text>
              </TouchableOpacity>
            </>
          )}
          
          {isCompleted && (
             <View className="flex-1 bg-gray-50 border border-gray-200 py-2.5 rounded-xl flex-row justify-center items-center gap-1.5 opacity-70">
              <CheckCircle2 color="#6b7280" size={16} />
              <Text className="text-gray-500 text-sm font-medium">Done</Text>
            </View>
          )}
          
        </View>
      </View>
    </View>
  );
};

export default TaskCard;
