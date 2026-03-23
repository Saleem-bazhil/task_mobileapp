import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
// 1. Import the Task interface from your TaskCard file
import TaskCard, { Task } from '../components/TaskScreenComponents/TaskCard';
import { CheckCircle2 } from 'lucide-react-native';
import api from '../api/Api';

const CompletedTasks = () => {
  // 2. Explicitly define TypeScript types for your state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const res = await api.get('/api/tasks/?status=completed');
        setTasks(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Could not load completed tasks', err);
        setError('Unable to fetch completed tasks from backend.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompletedTasks();
  }, []);

  // 3. Handle loading and empty states natively
  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View className="py-10 items-center justify-center">
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      );
    }
    if (!error && tasks.length === 0) {
      return (
        <View className="py-10 items-center justify-center">
          <Text className="text-gray-500 text-base">No completed tasks found.</Text>
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
        
        // 4. Header component integrated into the FlatList
        ListHeaderComponent={
          <View className="mb-6 mt-2">
            {error ? (
              <View className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <Text className="text-sm text-red-700 font-medium">{error}</Text>
              </View>
            ) : null}
            
            <View className="flex-row items-center mb-1">
              <Text className="text-3xl font-extrabold text-[#1A2238] tracking-tight mr-2">
                Completed Tasks
              </Text>
              {/* Native lucide icon requires explicit color and size */}
              <CheckCircle2 color="#10B981" size={28} />
            </View>
            <Text className="text-gray-500 text-base">
              Review your previously completed assignments and history.
            </Text>
          </View>
        }
        
        // 5. Render the TaskCards
        renderItem={({ item }) => (
          <TaskCard 
            task={item} 
            isAccepted={false} 
            isCompleted={true} 
          />
        )}
      />
    </View>
  );
};

export default CompletedTasks;
