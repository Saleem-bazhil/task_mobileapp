import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
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
    <View className="flex-1 justify-center bg-slate-50 px-5">
      {/* Card */}
      <View className="rounded-3xl bg-white p-6 shadow-lg">
        
        {/* Header */}
        <View className="items-center">
          <View className="mb-5 h-14 w-14 items-center justify-center rounded-2xl bg-sky-100">
            <Icon name="message-square" size={26} color="#0284c7" />
          </View>

          <Text className="text-2xl font-bold text-slate-900">
            Welcome back
          </Text>
          <Text className="mt-2 text-center text-sm text-slate-500">
            Sign in to your workspace to continue.
          </Text>
        </View>

        {/* Error */}
        {error ? (
          <View className="mt-5 rounded-xl bg-rose-100 p-3">
            <Text className="text-center text-sm text-rose-600">
              {error}
            </Text>
          </View>
        ) : null}

        {/* Form */}
        <View className="mt-6 space-y-4">
          
          {/* Username */}
          <View>
            <Text className="mb-2 text-sm font-medium text-slate-700">
              Username
            </Text>
            <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-100 px-3">
              <Icon name="user" size={18} color="#64748b" />
              <TextInput
                value={loginForm.username}
                onChangeText={(text) =>
                  setLoginForm((prev) => ({ ...prev, username: text }))
                }
                placeholder="Enter your username"
                className="ml-2 flex-1 py-3 text-sm text-slate-900"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>

          {/* Password */}
          <View>
            <Text className="mb-2 text-sm font-medium text-slate-700">
              Password
            </Text>
            <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-100 px-3">
              <Icon name="lock" size={18} color="#64748b" />
              <TextInput
                value={loginForm.password}
                onChangeText={(text) =>
                  setLoginForm((prev) => ({ ...prev, password: text }))
                }
                secureTextEntry
                placeholder="••••••••"
                className="ml-2 flex-1 py-3 text-sm text-slate-900"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>

          {/* Button */}
          <TouchableOpacity
            onPress={handleLoginSubmit}
            disabled={isSubmitting}
            className="mt-4 flex-row items-center justify-center rounded-xl bg-slate-900 py-3"
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text className="mr-2 text-sm font-semibold text-white">
                  Sign in
                </Text>
                <Icon name="arrow-right" size={16} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}