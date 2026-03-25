import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import {
  CheckCircle2,
  Clock3,
  LogOut,
  Mail,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../context/useAuth';
import { fetchProfileOverview } from '../services/tasks';
import Header from '../components/Header';

function formatRole(role?: string) {
  if (!role) return 'Employee';
  return role
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getInitials(user: any) {
  const first = user?.first_name?.trim()?.[0];
  const last = user?.last_name?.trim()?.[0];
  const username = user?.username?.trim()?.[0];
  return [first, last].filter(Boolean).join('').toUpperCase() || username?.toUpperCase() || 'U';
}

const overviewCards = [
  { label: 'Total', key: 'total', icon: Target, color: '#7C3AED', bg: 'bg-violet-50' },
  { label: 'Pending', key: 'pending', icon: Clock3, color: '#E41F6A', bg: 'bg-pink-50' },
  { label: 'In Progress', key: 'in_progress', icon: Clock3, color: '#2563EB', bg: 'bg-blue-50' },
  { label: 'Completed', key: 'completed', icon: CheckCircle2, color: '#059669', bg: 'bg-emerald-50' },
] as const;

const ProfileContent = () => {
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

  const derived = useMemo(() => {
    const completed = stats?.completed ?? 0;
    const total = stats?.total ?? 0;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completionRate };
  }, [stats]);

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
    <View className="flex-1 bg-[#FFF6FA]">
      <Header title="Profile" />
      <ScrollView
        className="flex-1 bg-[#FFF6FA]"
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-5 overflow-hidden rounded-[30px] bg-white shadow-lg">
        <View className="bg-[#E41F6A] px-5 pb-7 pt-5">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="rounded-full bg-white/15 px-3 py-1">
              <Text className="text-xs font-semibold uppercase tracking-[1.4px] text-white">
                Profile
              </Text>
            </View>
            <Sparkles size={20} color="#FFFFFF" />
          </View>

          <View className="flex-row items-center">
            <View className="mr-4 h-20 w-20 items-center justify-center rounded-[26px] bg-white/15">
              <Text className="text-3xl font-extrabold text-white">{getInitials(user)}</Text>
            </View>

            <View className="flex-1">
              <Text className="text-3xl font-extrabold text-white">{fullName}</Text>
              <Text className="mt-1 text-sm text-white/85">@{user?.username || 'user'}</Text>

              <View className="mt-3 flex-row flex-wrap gap-2">
                <View className="flex-row items-center rounded-full bg-white/15 px-3 py-1.5">
                  <ShieldCheck size={13} color="#FFFFFF" />
                  <Text className="ml-2 text-xs font-semibold text-white">
                    {formatRole((user as any)?.role)}
                  </Text>
                </View>
                <View className="flex-row items-center rounded-full bg-white/15 px-3 py-1.5">
                  <Mail size={13} color="#FFFFFF" />
                  <Text className="ml-2 text-xs font-semibold text-white">
                    {user?.email || 'No email'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className="px-5 py-5">
          <View className="overflow-hidden rounded-[24px] bg-[#3B1F31] px-4 py-4">
            <View className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-pink-400/15" />
            <View className="absolute -bottom-8 -left-4 h-28 w-28 rounded-full bg-white/5" />
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm font-medium text-white/70">Completion Rate</Text>
                <Text className="mt-2 text-3xl font-extrabold text-white">
                  {derived.completionRate}%
                </Text>
              </View>
              <View className="rounded-2xl bg-white/10 px-3 py-2">
                <Text className="text-xs font-semibold uppercase tracking-[1.2px] text-white/75">
                  {stats?.total ?? 0} Tasks
                </Text>
              </View>
            </View>

            <View className="mt-4 h-2 rounded-full bg-white/12">
              <View
                className="h-2 rounded-full bg-pink-500"
                style={{ width: `${Math.min(derived.completionRate, 100)}%` }}
              />
            </View>
          </View>
        </View>
      </View>

      {error ? (
        <View className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
          <Text className="text-sm font-medium text-rose-700">{error}</Text>
        </View>
      ) : null}

      <View className="mb-5 rounded-[30px] bg-white p-5 shadow-lg">
        <Text className="text-xs font-semibold uppercase tracking-[1.4px] text-pink-700">
          Snapshot
        </Text>
        <Text className="mt-2 text-2xl font-extrabold text-slate-900">Workload overview</Text>
        <Text className="mt-1 text-sm leading-5 text-slate-500">
          A quick view of active work, completed delivery, and approaching deadlines.
        </Text>

        <View className="mt-5 flex-row flex-wrap justify-between">
          {overviewCards.map((item) => {
            const Icon = item.icon;

            return (
              <View
                key={item.label}
                className={`mb-4 w-[48.3%] ${item.label === 'Total' ? 'rounded-[28px]' : 'rounded-[24px]'} ${item.bg} p-4`}
              >
                <View className="mb-4 h-12 w-12 items-center justify-center rounded-2xl bg-white">
                  <Icon size={20} color={item.color} />
                </View>
                <Text className="text-sm font-medium text-slate-500">{item.label}</Text>
                <Text className="mt-1 text-2xl font-extrabold text-slate-900">
                  {stats?.[item.key] ?? 0}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <Pressable
        onPress={handleLogout}
        className="overflow-hidden rounded-[22px] bg-[#2A1521] px-5 py-4 shadow-lg active:bg-[#341A29]"
      >
        <View className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-pink-400/10" />
        <View className="absolute -bottom-8 left-8 h-20 w-20 rounded-full bg-white/5" />

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <LogOut size={18} color="#FFFFFF" />
            </View>

            <View className="ml-4">
              <Text className="text-base font-semibold text-white">Log Out</Text>
              <Text className="mt-1 text-sm text-white/65">
                Securely sign out from your workspace
              </Text>
            </View>
          </View>

          <View className="rounded-full bg-white/10 px-3 py-1.5">
            <Text className="text-xs font-semibold uppercase tracking-[1.2px] text-pink-200">
              Exit
            </Text>
          </View>
        </View>
      </Pressable>
      </ScrollView>
    </View>
  );
};

const Profile = () => <ProfileContent />;

export default Profile;
