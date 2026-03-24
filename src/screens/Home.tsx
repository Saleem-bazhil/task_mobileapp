import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

import ActivityTimeline from '../components/HomeScreenComponents/ActivityTimeline';
import DashboardCards from '../components/HomeScreenComponents/DashboardCards';
import RecentTasks from '../components/HomeScreenComponents/RecentTasks';
import { useAuth } from '../context/useAuth';
import { fetchDashboard } from '../services/tasks';

interface DashboardData {
  viewer_role?: string;
  stats?: any;
  recent_tasks?: any[];
  activities?: any[];
}

const Home = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setIsLoading(true);

      try {
        const response = await fetchDashboard();
        if (!cancelled) {
          setDashboard(response);
          setError('');
        }
      } catch {
        if (!cancelled) {
          setError('Unable to load the dashboard right now.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const isAdmin = dashboard?.viewer_role === 'admin';

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)]">
        <Text className="text-xs uppercase tracking-widest text-pink-700">
          Overview
        </Text>
        <Text className="mt-3 text-3xl font-semibold text-slate-900">
          Welcome back, {user?.username || 'User'}
        </Text>
        <Text className="mt-3 text-sm leading-6 text-slate-500">
          {isAdmin
            ? 'Track team delivery, review assignment load, and spot overdue work before it slips.'
            : 'Review your current workload, recent changes, and upcoming deadlines from one place.'}
        </Text>
      </View>

      {error ? (
        <View className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
          <Text className="text-sm text-rose-700">{error}</Text>
        </View>
      ) : null}

      {isLoading ? (
        <View className="mt-6 items-center justify-center rounded-[1.75rem] border border-slate-200 bg-white p-12 shadow-sm">
          <ActivityIndicator size="large" color="#E41F6A" />
          <Text className="mt-4 text-sm text-slate-500">Loading dashboard...</Text>
        </View>
      ) : (
        <View className="mt-8">
          <DashboardCards stats={dashboard?.stats} />

          <View className="mt-8">
            <RecentTasks tasks={dashboard?.recent_tasks} isAdmin={isAdmin} />
          </View>

          <View className="mt-8">
            <ActivityTimeline activities={dashboard?.activities} />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default Home;
