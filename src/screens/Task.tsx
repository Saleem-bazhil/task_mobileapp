import React from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Briefcase, CheckCircle, ListTodo, ChevronRight } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { TaskStackParamList } from '../navigation/TaskStack';

interface TaskCardProps {
  title: string;
  subtitle: string;
  count: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  onPress: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  subtitle,
  count,
  icon,
  iconBgColor,
  onPress,
}) => {
  return (
    <TouchableOpacity
      className="mb-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)]"
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View className="flex-row items-center justify-between">
        
        <View className="flex-row items-center flex-1">
          <View className={`w-14 h-14 rounded-[1.25rem] mr-4 items-center justify-center ${iconBgColor}`}>
            {icon}
          </View>
          <View className="flex-1 pr-2">
            <Text className="text-xl font-bold tracking-tight text-slate-900 mb-0.5">
              {title}
            </Text>
            <Text className="text-[13px] font-medium text-slate-500">
              {subtitle}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center">
          <View className="mr-3 min-w-[32px] items-center justify-center rounded-xl bg-slate-100 px-3 py-1.5 border border-slate-200">
            <Text className="text-sm font-bold text-slate-700">{count}</Text>
          </View>
          <ChevronRight size={22} color="#cbd5e1" />
        </View>

      </View>
    </TouchableOpacity>
  );
};

type TaskDashboardNavigationProp = NativeStackNavigationProp<
  TaskStackParamList,
  'TaskDashboard'
>;

const TaskDashboard: React.FC = () => {
  const navigation = useNavigation<TaskDashboardNavigationProp>();

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 40,
          paddingTop: Platform.OS === 'android' ? 40 : 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6 mt-4 items-center px-2 py-6 bg-white rounded-[2rem] border border-slate-200 shadow-sm">
          <Text className="mb-2 text-[10px] uppercase tracking-[0.2em] font-bold text-pink-600">
            Dashboard
          </Text>
          <Text className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Your Tasks
          </Text>
          <Text className="text-[15px] font-medium text-slate-500 text-center px-4 leading-6">
            Review your pending assignments, accepted projects, and completed work.
          </Text>
        </View>

        <Text className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-4 ml-2">Collections</Text>

        <TaskCard
          title="My Tasks"
          subtitle="Pending and active tasks"
          count="12"
          iconBgColor="bg-pink-50 border border-pink-100"
          icon={<ListTodo size={24} color="#E41F6A" />}
          onPress={() => navigation.navigate('MyTasks')}
        />
        <TaskCard
          title="Accepted"
          subtitle="Tasks you have taken on"
          count="5"
          iconBgColor="bg-emerald-50 border border-emerald-100"
          icon={<Briefcase size={24} color="#059669" />}
          onPress={() => navigation.navigate('AcceptedTasks')}
        />
        <TaskCard
          title="Completed"
          subtitle="Archived and finished work"
          count="48"
          iconBgColor="bg-slate-100 border border-slate-200"
          icon={<CheckCircle size={24} color="#475569" />}
          onPress={() => navigation.navigate('CompletedTasks')}
        />
      </ScrollView>
    </View>
  );
};

export default TaskDashboard;
