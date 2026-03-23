import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';

// Assuming these paths match your React Native project structure
import ActivityTimeline from '../components/HomeScreenComponents/ActivityTimeline';
import DashboardCards from '../components/HomeScreenComponents/DashboardCards';
import RecentTasks from '../components/HomeScreenComponents/RecentTasks';
import { useAuth } from '../context/useAuth';
import { fetchDashboard } from '../services/tasks';

// 1. Define strict TypeScript interfaces for your data
interface DashboardData {
  viewer_role?: string;
  stats?: any; // You can replace 'any' with the Stats interface from DashboardCards
  recent_tasks?: any[]; // You can replace 'any' with the Task interface from RecentTasks
  activities?: any[]; // You can replace 'any' with the Activity interface from ActivityTimeline
}

const Home = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

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
    // Replaced outer div with ScrollView to ensure it doesn't get cut off on small phones
    <ScrollView 
      className="flex-1 bg-slate-50" 
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 space-y-8 p-6">
        
        {/* Overview Section */}
        {/* Removed CSS radial-gradient as RN doesn't support it natively via Tailwind */}
        <View className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <Text className="text-xs uppercase tracking-widest text-sky-700">Overview</Text>
          <Text className="mt-3 text-3xl font-semibold text-slate-900">
            Welcome back, {user?.username || 'User'}
          </Text>
          <Text className="mt-3 text-sm leading-6 text-slate-500">
            {isAdmin
              ? 'Track team delivery, review assignment load, and spot overdue work before it slips.'
              : 'Review your current workload, recent changes, and upcoming deadlines from one place.'}
          </Text>
        </View>

        {/* Error State */}
        {error ? (
          <View className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
            <Text className="text-sm text-rose-700">{error}</Text>
          </View>
        ) : null}

        {/* Loading / Content State */}
        {isLoading ? (
          <View className="items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 shadow-sm">
            {/* Added native spinning loader */}
            <ActivityIndicator size="large" color="#0284c7" /> 
            <Text className="mt-4 text-sm text-slate-500">Loading dashboard...</Text>
          </View>
        ) : (
          <View className="flex-col gap-8">
            <DashboardCards stats={dashboard?.stats} />

            {/* Stacked vertically instead of CSS Grid for mobile compatibility */}
            <View className="flex-col gap-8">
              <RecentTasks tasks={dashboard?.recent_tasks} isAdmin={isAdmin} />
              <ActivityTimeline activities={dashboard?.activities} />
            </View>
          </View>
        )}

      </View>
    </ScrollView>
  );
};

export default Home;