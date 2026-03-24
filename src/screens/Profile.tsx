import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { 
  CalendarDays, 
  CheckCircle2, 
  Clock3, 
  ListTodo, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  User2,
  LogOut
} from "lucide-react-native";

import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/useAuth";
import { fetchProfileOverview } from "../services/tasks";

// Fallback in case fetchProfileOverview is not implemented
// import { fetchProfileOverview } from "../services/tasks"

function formatRole(role?: string) {
  if (!role) return "Employee";
  return role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(dateValue?: string) {
  if (!dateValue) return "Not set";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Not set";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getInitials(user: any) {
  const first = user?.first_name?.trim()?.[0];
  const last = user?.last_name?.trim()?.[0];
  const username = user?.username?.trim()?.[0];
  return [first, last].filter(Boolean).join("").toUpperCase() || username?.toUpperCase() || "U";
}

export default function Profile() {
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();
  const [overview, setOverview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      setIsLoading(true);
      try {
        const response = await fetchProfileOverview();
        if (!cancelled) {
          setOverview(response);
          setError("");
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load your profile details right now.");
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

  const fullName = [(user as any)?.first_name, (user as any)?.last_name].filter(Boolean).join(" ").trim() || user?.username || "User";
  const stats = overview?.dashboard?.stats;
  const tasks = overview?.tasks ?? [];

  const derived = useMemo(() => {
    const completed = stats?.completed ?? 0;
    const total = stats?.total ?? 0;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const nextDueTask = tasks
      .filter((task: any) => task.due_date && task.status !== "completed")
      .sort((left: any, right: any) => new Date(left.due_date).getTime() - new Date(right.due_date).getTime())[0];

    const highPriorityOpen = tasks.filter(
      (task: any) => task.priority === "high" && task.status !== "completed"
    ).length;

    const recentTasks = [...tasks]
      .sort((left: any, right: any) => new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime())
      .slice(0, 4);

    return {
      completionRate,
      nextDueTask,
      highPriorityOpen,
      recentTasks,
    };
  }, [stats, tasks]);

  // Handle Progress Bar Width mapping
  const calculateWidth = (val: number, max: number) => {
    return `${Math.max((val / Math.max(max, 1)) * 100, 8)}%`;
  };

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#0284c7" />
        <Text className="mt-4 text-slate-500 font-medium">Loading profile data...</Text>
      </View>
    );
  }

  if (error && !overview) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center px-6">
        <View className="bg-rose-50 border border-rose-200 rounded-3xl p-6 items-center">
          <Text className="text-rose-700 text-center font-medium mb-4">{error}</Text>
          <Pressable onPress={handleLogout} className="bg-rose-100 px-4 py-2 rounded-xl border border-rose-200">
            <Text className="text-rose-800 font-semibold">Log Out</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-50" showsVerticalScrollIndicator={false}>
      
      {/* HEADER SECTION (Equivalent to the deep blue/gradient hero) */}
      <View className="bg-[#0f172a] px-6 py-8 rounded-b-[2rem] shadow-sm relative">
        <View className="flex-row items-center mb-6">
          <View className="h-20 w-20 items-center justify-center rounded-[1.5rem] border border-white/20 bg-white/10 shadow-lg mr-4">
            <Text className="text-3xl font-semibold text-white">{getInitials(user)}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[10px] uppercase tracking-[0.2em] text-sky-200 font-bold mb-1">Profile</Text>
            <Text className="text-2xl font-semibold tracking-tight text-white mb-2">{fullName}</Text>
            
            <View className="flex-row items-center bg-white/10 rounded-full px-2 py-1.5 self-start mb-2 border border-white/15">
              <ShieldCheck size={12} color="#f8fafc" className="mr-1" />
              <Text className="text-xs text-slate-100 ml-1">{formatRole((user as any)?.role)}</Text>
            </View>
            <View className="flex-row items-center bg-white/10 rounded-full px-2 py-1.5 self-start border border-white/15">
              <Mail size={12} color="#f8fafc" className="mr-1" />
              <Text className="text-xs text-slate-100 ml-1">{user?.email || "No email"}</Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
            <Text className="text-[10px] uppercase tracking-[0.15em] text-sky-200 mt-1">Completion</Text>
            <Text className="mt-1 text-2xl font-semibold text-white">{derived.completionRate}%</Text>
          </View>
          <View className="flex-1 rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
            <Text className="text-[10px] uppercase tracking-[0.15em] text-sky-200 mt-1">Focus</Text>
            <Text className="mt-1 text-2xl font-semibold text-white">{derived.highPriorityOpen}</Text>
          </View>
        </View>
      </View>

      <View className="px-4 py-6">
        
        {/* STATS 4-GRID */}
        <View className="flex-row flex-wrap justify-between mb-6">
          <View className="w-[48%] rounded-3xl border border-slate-200 bg-white p-4 mb-3 shadow-sm shadow-slate-200/50">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xs font-medium text-slate-500">Total tasks</Text>
              <ListTodo size={18} color="#0284c7" />
            </View>
            <Text className="text-2xl font-semibold text-slate-900">{stats?.total ?? 0}</Text>
          </View>
          <View className="w-[48%] rounded-3xl border border-slate-200 bg-white p-4 mb-3 shadow-sm shadow-slate-200/50">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xs font-medium text-slate-500">In progress</Text>
              <Clock3 size={18} color="#d97706" />
            </View>
            <Text className="text-2xl font-semibold text-slate-900">{stats?.in_progress ?? 0}</Text>
          </View>
          <View className="w-[48%] rounded-3xl border border-slate-200 bg-white p-4 mb-3 shadow-sm shadow-slate-200/50">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xs font-medium text-slate-500">Completed</Text>
              <CheckCircle2 size={18} color="#059669" />
            </View>
            <Text className="text-2xl font-semibold text-slate-900">{stats?.completed ?? 0}</Text>
          </View>
          <View className="w-[48%] rounded-3xl border border-slate-200 bg-white p-4 mb-3 shadow-sm shadow-slate-200/50">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xs font-medium text-slate-500">Due soon</Text>
              <CalendarDays size={18} color="#e11d48" />
            </View>
            <Text className="text-2xl font-semibold text-slate-900">{stats?.due_soon ?? 0}</Text>
          </View>
        </View>

        {/* RECENT TASK ACTIVITY */}
        <View className="rounded-[1.75rem] border border-slate-200 bg-white p-5 mb-6 shadow-sm shadow-slate-200/50">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-lg font-semibold text-slate-900">Recent activity</Text>
            </View>
            <View className="flex-row items-center bg-slate-100 px-2 py-1 rounded-full">
              <Sparkles size={12} color="#64748b" />
              <Text className="ml-1 text-[10px] font-medium uppercase tracking-widest text-slate-500">Live</Text>
            </View>
          </View>

          <View className="gap-3">
            {derived.recentTasks.length > 0 ? (
              derived.recentTasks.map((task: any) => (
                <View key={task.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <Text className="font-medium text-slate-900 mb-1">{task.title}</Text>
                  <Text className="text-xs text-slate-500 mb-3" numberOfLines={2}>
                    {task.description || "No description provided."}
                  </Text>
                  <View className="flex-row flex-wrap gap-2 mb-2">
                    <View className="rounded-full bg-white px-2 py-1 border border-slate-200">
                      <Text className="text-[10px] font-medium uppercase tracking-widest text-slate-500">{task.status.replace("_", " ")}</Text>
                    </View>
                    <View className="rounded-full bg-white px-2 py-1 border border-slate-200">
                      <Text className="text-[10px] font-medium uppercase tracking-widest text-slate-500">{task.priority} prio</Text>
                    </View>
                  </View>
                  <Text className="text-[10px] text-slate-400">Updated {formatDate(task.updated_at)}</Text>
                </View>
              ))
            ) : (
              <View className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 items-center flex-row justify-center">
                <Text className="text-sm text-slate-500 text-center">No task activity yet.</Text>
              </View>
            )}
          </View>
        </View>

        {/* NEXT DUE TASK */}
        <View className="rounded-[1.75rem] border border-slate-200 bg-white p-5 mb-6 shadow-sm shadow-slate-200/50">
          <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Next due task</Text>
          <Text className="text-lg font-semibold text-slate-900 mb-1">
            {derived.nextDueTask?.title || "Nothing scheduled"}
          </Text>
          <Text className="text-sm text-slate-500 mb-4" numberOfLines={3}>
            {derived.nextDueTask
              ? derived.nextDueTask.description || "This task has no description yet."
              : "You do not have any incomplete tasks with a due date."}
          </Text>
          
          <View className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <Text className="text-sm font-medium text-slate-900 mb-1">Due date</Text>
            <Text className="text-sm text-slate-600">{formatDate(derived.nextDueTask?.due_date)}</Text>
          </View>
        </View>

        {/* WORKLOAD SNAPSHOT */}
        <View className="rounded-[1.75rem] border border-slate-200 bg-white p-5 mb-6 shadow-sm shadow-slate-200/50">
          <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Workload snapshot</Text>
          
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-1.5">
              <Text className="text-xs text-slate-600 font-medium">Pending</Text>
              <Text className="text-xs text-slate-600 font-medium">{stats?.pending ?? 0}</Text>
            </View>
            <View className="h-1.5 rounded-full bg-slate-100 w-full overflow-hidden">
              <View className="h-full bg-[#0ea5e9]" style={{ width: calculateWidth(stats?.pending ?? 0, stats?.total ?? 1) as any }} />
            </View>
          </View>
          
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-1.5">
              <Text className="text-xs text-slate-600 font-medium">In progress</Text>
              <Text className="text-xs text-slate-600 font-medium">{stats?.in_progress ?? 0}</Text>
            </View>
            <View className="h-1.5 rounded-full bg-slate-100 w-full overflow-hidden">
              <View className="h-full bg-[#f59e0b]" style={{ width: calculateWidth(stats?.in_progress ?? 0, stats?.total ?? 1) as any }} />
            </View>
          </View>
          
          <View className="mb-1">
            <View className="flex-row items-center justify-between mb-1.5">
              <Text className="text-xs text-slate-600 font-medium">Completed</Text>
              <Text className="text-xs text-slate-600 font-medium">{stats?.completed ?? 0}</Text>
            </View>
            <View className="h-1.5 rounded-full bg-slate-100 w-full overflow-hidden">
              <View className="h-full bg-[#10b981]" style={{ width: calculateWidth(stats?.completed ?? 0, stats?.total ?? 1) as any }} />
            </View>
          </View>
        </View>

        {/* LOGOUT BUTTON */}
        <Pressable 
          onPress={handleLogout}
          className="rounded-[1.75rem] border border-rose-200 bg-white p-4 mb-10 flex-row items-center justify-center active:bg-rose-50 shadow-sm shadow-slate-200/50"
        >
          <LogOut size={18} color="#e11d48" className="mr-2" />
          <Text className="ml-2 text-rose-600 font-semibold text-sm">Log Out</Text>
        </Pressable>

      </View>
    </ScrollView>
  );
}
