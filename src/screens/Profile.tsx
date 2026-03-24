import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  LogOut,
  Mail,
  ShieldCheck,
  Sparkles,
  User2,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../context/useAuth';
import { fetchProfileOverview } from '../services/tasks';

function formatRole(role?: string) {
  if (!role) return 'Employee';
  return role
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatDate(dateValue?: string) {
  if (!dateValue) return 'Not set';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'Not set';
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function getInitials(user: any) {
  const first = user?.first_name?.trim()?.[0];
  const last = user?.last_name?.trim()?.[0];
  const username = user?.username?.trim()?.[0];
  return [first, last].filter(Boolean).join('').toUpperCase() || username?.toUpperCase() || 'U';
}

export default function Profile() {
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();
  const [overview, setOverview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      setIsLoading(true);
      try {
        const response = await fetchProfileOverview();
        if (!cancelled) {
          setOverview(response);
          setError('');
        }
      } catch {
        if (!cancelled) {
          setError('Unable to load your profile details right now.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const fullName =
    [(user as any)?.first_name, (user as any)?.last_name].filter(Boolean).join(' ').trim() ||
    user?.username ||
    'User';
  const stats = overview?.dashboard?.stats;
  const tasks = overview?.tasks ?? [];

  const derived = useMemo(() => {
    const completed = stats?.completed ?? 0;
    const total = stats?.total ?? 0;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const nextDueTask = tasks
      .filter((task: any) => task.due_date && task.status !== 'completed')
      .sort((left: any, right: any) => new Date(left.due_date).getTime() - new Date(right.due_date).getTime())[0];

    const recentTasks = [...tasks]
      .sort((left: any, right: any) => new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime())
      .slice(0, 3);

    return { completionRate, nextDueTask, recentTasks };
  }, [stats, tasks]);

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FFF6FA]">
        <ActivityIndicator size="large" color="#E41F6A" />
        <Text className="mt-4 text-sm text-slate-500">Loading profile data...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#FFF6FA]" contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <View className="mb-5 overflow-hidden rounded-[28px] bg-white shadow-lg">
        <View className="bg-[#E41F6A] px-5 pb-6 pt-5">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xs font-semibold uppercase tracking-[1.4px] text-white">Profile</Text>
            <Sparkles size={20} color="#FFFFFF" />
          </View>

          <View className="flex-row items-center">
            <View className="mr-4 h-20 w-20 items-center justify-center rounded-[24px] bg-white/15">
              <Text className="text-3xl font-extrabold text-white">{getInitials(user)}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-3xl font-extrabold text-white">{fullName}</Text>
              <View className="mt-3 flex-row flex-wrap gap-2">
                <View className="flex-row items-center rounded-full bg-white/15 px-3 py-1">
                  <ShieldCheck size={13} color="#FFFFFF" />
                  <Text className="ml-2 text-xs font-semibold text-white">{formatRole((user as any)?.role)}</Text>
                </View>
                <View className="flex-row items-center rounded-full bg-white/15 px-3 py-1">
                  <Mail size={13} color="#FFFFFF" />
                  <Text className="ml-2 text-xs font-semibold text-white">{user?.email || 'No email'}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-row justify-between px-5 py-5">
          <View className="flex-1 rounded-2xl bg-slate-50 px-4 py-3 mr-2">
            <Text className="text-xs font-semibold uppercase tracking-[1.3px] text-slate-400">Completion</Text>
            <Text className="mt-2 text-2xl font-extrabold text-slate-900">{derived.completionRate}%</Text>
          </View>
          <View className="flex-1 rounded-2xl bg-slate-50 px-4 py-3 ml-2">
            <Text className="text-xs font-semibold uppercase tracking-[1.3px] text-slate-400">Total Tasks</Text>
            <Text className="mt-2 text-2xl font-extrabold text-slate-900">{stats?.total ?? 0}</Text>
          </View>
        </View>
      </View>

      {error ? (
        <View className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
          <Text className="text-sm font-medium text-rose-700">{error}</Text>
        </View>
      ) : null}

      <View className="mb-5 rounded-[28px] bg-white p-5 shadow-lg">
        <Text className="text-xs font-semibold uppercase tracking-[1.4px] text-pink-700">Snapshot</Text>
        <Text className="mt-2 text-2xl font-extrabold text-slate-900">Workload overview</Text>

        <View className="mt-5 flex-row flex-wrap justify-between">
          {[
            { label: 'In Progress', value: stats?.in_progress ?? 0, icon: Clock3, color: '#2563EB' },
            { label: 'Completed', value: stats?.completed ?? 0, icon: CheckCircle2, color: '#059669' },
            { label: 'Due Soon', value: stats?.due_soon ?? 0, icon: CalendarDays, color: '#E41F6A' },
            { label: 'Profile', value: 1, icon: User2, color: '#7C3AED' },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <View key={item.label} className="mb-4 w-[48%] rounded-[24px] bg-slate-50 p-4">
                <View className="mb-3 h-11 w-11 items-center justify-center rounded-2xl bg-white">
                  <Icon size={20} color={item.color} />
                </View>
                <Text className="text-sm font-medium text-slate-500">{item.label}</Text>
                <Text className="mt-1 text-2xl font-extrabold text-slate-900">{item.value}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View className="mb-5 rounded-[28px] bg-white p-5 shadow-lg">
        <Text className="text-xs font-semibold uppercase tracking-[1.4px] text-pink-700">Next Up</Text>
        <Text className="mt-2 text-2xl font-extrabold text-slate-900">
          {derived.nextDueTask?.title || 'Nothing scheduled'}
        </Text>
        <Text className="mt-2 text-sm leading-6 text-slate-500">
          {derived.nextDueTask
            ? derived.nextDueTask.description || 'This task has no description yet.'
            : 'You do not have any incomplete tasks with a due date.'}
        </Text>
        <View className="mt-4 rounded-[24px] bg-slate-50 px-4 py-4">
          <Text className="text-xs font-semibold uppercase tracking-[1.3px] text-slate-400">Due date</Text>
          <Text className="mt-2 text-base font-semibold text-slate-900">
            {formatDate(derived.nextDueTask?.due_date)}
          </Text>
        </View>
      </View>

      <View className="mb-5 rounded-[28px] bg-white p-5 shadow-lg">
        <Text className="text-xs font-semibold uppercase tracking-[1.4px] text-pink-700">Recent Activity</Text>
        <Text className="mt-2 text-2xl font-extrabold text-slate-900">Latest updates</Text>

        <View className="mt-4 gap-3">
          {derived.recentTasks.length > 0 ? (
            derived.recentTasks.map((task: any) => (
              <View key={task.id} className="rounded-[24px] bg-slate-50 p-4">
                <Text className="text-base font-semibold text-slate-900">{task.title}</Text>
                <Text className="mt-1 text-sm leading-5 text-slate-500" numberOfLines={2}>
                  {task.description || 'No description provided.'}
                </Text>
                <Text className="mt-3 text-xs font-medium text-slate-400">
                  Updated {formatDate(task.updated_at)}
                </Text>
              </View>
            ))
          ) : (
            <View className="rounded-[24px] bg-slate-50 px-5 py-8">
              <Text className="text-center text-sm leading-6 text-slate-500">No task activity yet.</Text>
            </View>
          )}
        </View>
      </View>

      <Pressable
        onPress={handleLogout}
        className="flex-row items-center justify-center rounded-[28px] bg-white px-5 py-4 shadow-lg active:scale-95"
      >
        <LogOut size={18} color="#E11D48" />
        <Text className="ml-2 text-sm font-semibold text-rose-600">Log Out</Text>
      </Pressable>
    </ScrollView>
  );
}
