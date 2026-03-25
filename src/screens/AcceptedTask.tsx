import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native';
import TaskCard, { Task } from '../components/TaskScreenComponents/TaskCard';
import api from '../api/Api';
import Header from '../components/Header';

const AcceptedTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAcceptedTasks() {
      try {
        const res = await api.get<Task[]>('/api/tasks/?status=in_progress');
        setTasks(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Could not load active tasks', err);
        setError('Unable to fetch active tasks from backend.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAcceptedTasks();
  }, []);

  const handleCompleteTask = async (taskId: string | number) => {
    try {
      await api.patch(`/api/tasks/${taskId}/`, { status: 'completed' });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error('Failed to complete task', err);
      Alert.alert('Error', 'There was a problem completing this task.');
    }
  };

  return (
    <View className="flex-1 bg-[#FFF6FA]">
      <Header title="In Progress" showBack />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="mb-5 rounded-[28px] bg-white p-5 shadow-lg">
            {error ? (
              <View className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                <Text className="text-sm font-medium text-rose-700">{error}</Text>
              </View>
            ) : null}
            <Text className="text-xs font-semibold uppercase tracking-[1.4px] text-pink-700">Active Delivery</Text>
            <Text className="mt-2 text-3xl font-extrabold text-slate-900">In Progress</Text>
            <Text className="mt-2 text-sm leading-6 text-slate-500">
              Keep your in-flight work moving and mark tasks complete as you finish them.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View className="rounded-[28px] bg-white px-6 py-12 shadow-lg">
            {isLoading ? (
              <View className="items-center">
                <ActivityIndicator size="large" color="#E41F6A" />
                <Text className="mt-4 text-sm text-slate-500">Loading active tasks...</Text>
              </View>
            ) : !error ? (
              <View className="items-center">
                <Text className="text-lg font-semibold text-slate-700">No active tasks</Text>
                <Text className="mt-2 text-center text-sm leading-6 text-slate-500">
                  Accepted work will appear here while it is in progress.
                </Text>
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <TaskCard task={item} isAccepted={true} onComplete={() => handleCompleteTask(item.id)} />
        )}
      />
    </View>
  );
};

export default AcceptedTasks;
