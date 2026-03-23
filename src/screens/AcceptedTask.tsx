import React, { useState, useEffect } from 'react';
import { View, Text, Alert, FlatList, ActivityIndicator } from 'react-native';
import TaskCard, { Task } from '../components/TaskScreenComponents/TaskCard';
import api from '../api/Api';

const AcceptedTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAcceptedTasks = async () => {
      try {
        const res = await api.get<Task[]>('/api/tasks/?status=in_progress');
        setTasks(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Could not load active tasks', err);
        setError('Unable to fetch active tasks from backend.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAcceptedTasks();
  }, []);

  const handleCompleteTask = async (taskId: string | number) => {
    try {
      await api.patch(`/api/tasks/${taskId}/`, { status: 'completed' });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("Failed to complete task", err);
      Alert.alert("Error", "There was a problem completing this task.");
    }
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View className="py-10 items-center justify-center">
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      );
    }
    if (!error && tasks.length === 0) {
      return (
        <View className="py-10 items-center justify-center">
          <Text className="text-gray-500 text-base">No active tasks found.</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}

        ListHeaderComponent={
          <View className="mb-6 mt-2">
            {error ? (
              <View className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <Text className="text-sm text-red-700 font-medium">{error}</Text>
              </View>
            ) : null}
            
            <Text className="text-3xl font-extrabold text-[#1A2238] tracking-tight mb-1">
              Active Tasks
            </Text>
            <Text className="text-gray-500 text-base">
              Manage tasks you are currently working on.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            isAccepted={true}
            onComplete={() => handleCompleteTask(item.id)}
          />
        )}
      />
    </View>
  );
};

export default AcceptedTasks;
