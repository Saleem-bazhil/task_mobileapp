import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native';
import TaskCard, { Task } from '../components/TaskScreenComponents/TaskCard';
import api from '../api/Api';
import Header from '../components/Header';

const MyTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await api.get('/api/tasks/?status=pending');
        setTasks(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Could not load tasks', err);
        setError('Unable to fetch tasks from backend.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTasks();
  }, []);

  const handleAcceptTask = async (taskId: string | number) => {
    try {
      await api.patch(`/api/tasks/${taskId}/`, { status: 'in_progress' });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error('Failed to accept task', err);
      Alert.alert('Error', 'There was a problem accepting this task. Please try again.');
    }
  };

  return (
    <View className="flex-1 bg-[#FFF6FA]">
      <Header title="Assigned Tasks" showBack />
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
            <Text className="text-xs font-semibold uppercase tracking-[1.4px] text-pink-700">Assigned Queue</Text>
            <Text className="mt-2 text-3xl font-extrabold text-slate-900">Assigned Tasks</Text>
            <Text className="mt-2 text-sm leading-6 text-slate-500">
              Review new assignments and move them into active work when you are ready.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View className="rounded-[28px] bg-white px-6 py-12 shadow-lg">
            {isLoading ? (
              <View className="items-center">
                <ActivityIndicator size="large" color="#E41F6A" />
                <Text className="mt-4 text-sm text-slate-500">Loading tasks...</Text>
              </View>
            ) : !error ? (
              <View className="items-center">
                <Text className="text-lg font-semibold text-slate-700">No pending tasks</Text>
                <Text className="mt-2 text-center text-sm leading-6 text-slate-500">
                  New assignments will appear here as soon as they are available.
                </Text>
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <TaskCard task={item} isAccepted={false} onAccept={() => handleAcceptTask(item.id)} />
        )}
      />
    </View>
  );
};

export default MyTasks;
