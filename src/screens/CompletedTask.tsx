import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import TaskCard, { Task } from '../components/TaskScreenComponents/TaskCard';
import api from '../api/Api';

const CompletedTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCompletedTasks() {
      try {
        const res = await api.get('/api/tasks/?status=completed');
        setTasks(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Could not load completed tasks', err);
        setError('Unable to fetch completed tasks from backend.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompletedTasks();
  }, []);

  return (
    <View className="flex-1 bg-[#FFF6FA]">
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
            <Text className="text-xs font-semibold uppercase tracking-[1.4px] text-pink-700">Archive</Text>
            <Text className="mt-2 text-3xl font-extrabold text-slate-900">Completed tasks</Text>
            <Text className="mt-2 text-sm leading-6 text-slate-500">
              Review previously delivered work and keep a clear record of completed assignments.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View className="rounded-[28px] bg-white px-6 py-12 shadow-lg">
            {isLoading ? (
              <View className="items-center">
                <ActivityIndicator size="large" color="#E41F6A" />
                <Text className="mt-4 text-sm text-slate-500">Loading completed tasks...</Text>
              </View>
            ) : !error ? (
              <View className="items-center">
                <Text className="text-lg font-semibold text-slate-700">No completed tasks</Text>
                <Text className="mt-2 text-center text-sm leading-6 text-slate-500">
                  Finished work will appear here once tasks are marked complete.
                </Text>
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item }) => <TaskCard task={item} isCompleted={true} />}
      />
    </View>
  );
};

export default CompletedTasks;
