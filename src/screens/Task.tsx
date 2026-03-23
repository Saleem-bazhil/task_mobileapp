import React from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { TaskStackParamList } from '../navigation/TaskStack';

interface TaskCardProps {
  title: string;
  subtitle: string;
  count: string | number;
  color: string;
  onPress: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  subtitle,
  count,
  color,
  onPress,
}) => {
  return (
    <TouchableOpacity
      className="mb-5 rounded-[24px] border border-white/20 p-6 shadow-lg"
      style={{ backgroundColor: color }}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <Text className="mb-1.5 text-[22px] font-extrabold tracking-wide text-white">
            {title}
          </Text>
          <Text className="text-[15px] font-medium text-white/80">
            {subtitle}
          </Text>
        </View>

        <View className="flex-row items-center">
          <View className="mr-3 min-w-[36px] items-center justify-center rounded-full bg-white/25 px-3 py-1.5">
            <Text className="text-[15px] font-bold text-white">{count}</Text>
          </View>
          <Feather
            name="chevron-right"
            size={24}
            color="rgba(255,255,255,0.8)"
          />
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
    <View className="flex-1 bg-[#F9FAFB]">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 40,
          paddingTop: Platform.OS === 'android' ? 40 : 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8 mt-2 px-2">
          <Text className="mb-1.5 text-sm font-bold uppercase tracking-widest text-gray-400">
            Tasks Overview
          </Text>
          <Text className="mb-2 text-4xl font-black tracking-tight text-[#1A2238]">
            Hello there
          </Text>
          <Text className="text-base font-medium text-gray-500">
            You have pending tasks to complete today. Let's get to work!
          </Text>
        </View>

        <TaskCard
          title="MY TASKS"
          subtitle="Pending and active tasks"
          count="12"
          color="#3A72D8"
          onPress={() => navigation.navigate('MyTasks')}
        />
        <TaskCard
          title="ACCEPTED"
          subtitle="Tasks you have taken on"
          count="5"
          color="#10B981"
          onPress={() => navigation.navigate('AcceptedTasks')}
        />
        <TaskCard
          title="COMPLETED"
          subtitle="Archived and finished work"
          count="48"
          color="#4B5563"
          onPress={() => navigation.navigate('CompletedTasks')}
        />
      </ScrollView>
    </View>
  );
};

export default TaskDashboard;
