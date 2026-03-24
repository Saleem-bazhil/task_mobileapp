import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MessageSquare, User, Lock, ArrowRight } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { useAuth } from "../context/useAuth";

type LoginForm = {
  username: string;
  password: string;
};

export default function Login() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { login } = useAuth();

  const [loginForm, setLoginForm] = useState<LoginForm>({
    username: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const destination = route?.params?.from || "MainTabs";

  const handleLoginSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      await login({
        username: loginForm.username,
        password: loginForm.password
      });
      navigation.replace(destination);
    } catch (requestError: any) {
      const payload = requestError?.response?.data;
      const firstError =
        typeof payload === "object"
          ? Object.values(payload)[0]
          : null;

      setError(
        requestError?.response?.data?.detail ||
        (Array.isArray(firstError) ? firstError[0] : firstError) ||
        "Invalid username or password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-slate-50 px-5 relative">
      <View className="absolute top-0 w-full h-64 bg-slate-900 rounded-b-[3rem]" />

      {/* Card */}
      <View className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200 border border-slate-100 mt-12 mx-2">

        {/* Header */}
        <View className="items-center">
          <View className="mb-6 h-16 w-16 items-center justify-center rounded-[1.25rem] bg-sky-50 shadow-sm border border-sky-100">
            <MessageSquare size={28} color="#0284c7" />
          </View>

          <Text className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back
          </Text>
          <Text className="mt-2 text-center text-sm font-medium text-slate-500">
            Sign in to your workspace to continue.
          </Text>
        </View>

        {/* Error */}
        {error ? (
          <View className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <Text className="text-center text-sm font-medium text-rose-700">
              {error}
            </Text>
          </View>
        ) : null}

        {/* Form */}
        <View className="mt-8 space-y-5">

          {/* Username */}
          <View>
            <Text className="mb-2 text-[13px] font-bold uppercase tracking-wider text-slate-400 ml-1">
              Username
            </Text>
            <View className="flex-row items-center rounded-2xl border border-slate-200 bg-white px-4 h-14">
              <User size={20} color="#94a3b8" />
              <TextInput
                value={loginForm.username}
                onChangeText={(text) =>
                  setLoginForm((prev) => ({ ...prev, username: text }))
                }
                placeholder="Enter your username"
                className="ml-3 flex-1 text-[15px] font-medium text-slate-900 pt-3 pb-3"
                placeholderTextColor="#94a3b8"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password */}
          <View>
            <Text className="mb-2 text-[13px] font-bold uppercase tracking-wider text-slate-400 ml-1">
              Password
            </Text>
            <View className="flex-row items-center rounded-2xl border border-slate-200 bg-white px-4 h-14">
              <Lock size={20} color="#94a3b8" />
              <TextInput
                value={loginForm.password}
                onChangeText={(text) =>
                  setLoginForm((prev) => ({ ...prev, password: text }))
                }
                secureTextEntry
                placeholder="••••••••"
                className="ml-3 flex-1 text-[15px] font-medium text-slate-900 pt-3 pb-3"
                placeholderTextColor="#94a3b8"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Button */}
          <TouchableOpacity
            onPress={handleLoginSubmit}
            disabled={isSubmitting}
            className="mt-6 flex-row items-center justify-center rounded-2xl bg-slate-900 h-14 shadow-md shadow-slate-300 active:bg-slate-800"
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text className="mr-3 text-[15px] font-bold text-white tracking-wide">
                  Sign In
                </Text>
                <ArrowRight size={18} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}