import React, { useState, useEffect } from 'react';
import { View, Text, Alert, FlatList, ActivityIndicator } from 'react-native';
import TaskCard, { Task } from '../components/TaskScreenComponents/TaskCard';
import api from '../api/Api';

const MyTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/api/tasks/?status=pending');
        setTasks(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Could not load tasks', err);
        setError('Unable to fetch tasks from backend.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleAcceptTask = async (taskId: string | number) => {
    try {
      await api.patch(`/api/tasks/${taskId}/`, { status: 'in_progress' });
      // Remove the accepted task from the "pending" list
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("Failed to accept task", err);
      Alert.alert("Error", "There was a problem accepting this task. Please try again.");
    }
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View className="py-10 items-center justify-center">
          <ActivityIndicator size="large" color="#3A72D8" />
        </View>
      );
    }
    if (!error && tasks.length === 0) {
      return (
        <View className="py-10 items-center justify-center">
          <Text className="text-gray-500 text-base">No pending tasks available.</Text>
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
              My Assigned Tasks
            </Text>
            <Text className="text-gray-500 text-base">
              Review and accept your new assignments here.
            </Text>
          </View>
        }
        
        renderItem={({ item }) => (
          <TaskCard 
            task={item} 
            isAccepted={false} 
            onAccept={() => handleAcceptTask(item.id)} 
          />
        )}
      />
    </View>
  );
};

export default MyTasks;
