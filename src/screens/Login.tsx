import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  Animated,
  Dimensions,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
} from "react-native";
import { User, Lock, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useAuth } from "../context/useAuth";
import type { RootStackParamList } from "../navigation/AppNavigator";

type LoginForm = {
  username: string;
  password: string;
};

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Login">;

const { width, height } = Dimensions.get('window');
const BRAND_PINK = "#E41F6A";
const BRAND_PINK_DARK = "#C41E5E";
const BRAND_PINK_LIGHT = "#FF6B9D";
const LOGO_IMAGE = require("../assets/logo.png");

export default function Login({ navigation, route }: LoginScreenProps) {
  const { login } = useAuth();

  const [loginForm, setLoginForm] = useState<LoginForm>({
    username: "",
    password: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [focusedInput, setFocusedInput] = useState<"username" | "password" | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const errorShake = useRef(new Animated.Value(0)).current;

  const destination = route.params?.from ?? "MainTabs";

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, slideAnim]);

  const handleLoginSubmit = async () => {
    if (!loginForm.username || !loginForm.password) {
      setError("Please enter both your username and password.");
      animateError();
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await login({
        username: loginForm.username,
        password: loginForm.password,
      });
      navigation.replace(destination);
    } catch (requestError: any) {
      const payload = requestError?.response?.data;
      const firstError = typeof payload === "object" ? Object.values(payload)[0] : null;

      setError(
        requestError?.response?.data?.detail ||
          (Array.isArray(firstError) ? firstError[0] : firstError) ||
          "Invalid username or password. Please try again."
      );
      animateError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const animateError = () => {
    Animated.sequence([
      Animated.timing(errorShake, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(errorShake, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(errorShake, {
        toValue: 5,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(errorShake, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleButtonPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Gradient component for background
  const GradientBackground = () => (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <View 
        style={{ 
          flex: 1,
          backgroundColor: BRAND_PINK,
          opacity: 0.95,
        }} 
      />
      <View 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: BRAND_PINK_DARK,
          opacity: 0.3,
        }} 
      />
      <View 
        style={{ 
          position: 'absolute',
          top: -height * 0.3,
          right: -width * 0.3,
          width: width * 0.6,
          height: width * 0.6,
          borderRadius: width * 0.3,
          backgroundColor: BRAND_PINK_LIGHT,
          opacity: 0.2,
        }} 
      />
      <View 
        style={{ 
          position: 'absolute',
          bottom: -height * 0.2,
          left: -width * 0.2,
          width: width * 0.5,
          height: width * 0.5,
          borderRadius: width * 0.25,
          backgroundColor: '#FF9FBF',
          opacity: 0.15,
        }} 
      />
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 relative">
              {/* Gradient Background */}
              <GradientBackground />
              
              {/* Decorative Elements */}
              <View className="absolute top-20 right-5 opacity-20">
                <Sparkles size={100} color="#fff" />
              </View>
              <View className="absolute bottom-40 left-5 opacity-10">
                <Sparkles size={60} color="#fff" />
              </View>
              
              <Animated.View 
                className="flex-1"
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}
              >
                <View className="flex-1 justify-center px-6 pt-14 pb-8">
                  {/* Logo & Header Section */}
                  <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <View className="items-center mb-8">
                      <View className="mb-4 h-24 w-24 items-center justify-center rounded-2xl border border-white/25 bg-white/18">
                        <Image 
                          source={LOGO_IMAGE}
                          className="h-16 w-16 rounded-lg"
                          resizeMode="contain"
                        />
                      </View>
                      <Text className="mb-2 text-center text-4xl font-extrabold tracking-tight text-white">
                        Renderways
                      </Text>
                      <Text className="max-w-[280px] text-center text-[15px] font-medium leading-6 text-white/90">
                        Sign in to access your creative workspace
                      </Text>
                    </View>
                  </Animated.View>

                  {/* Main Card */}
                  <Animated.View 
                    className="rounded-[28px] bg-white/95 backdrop-blur-xl shadow-2xl"
                    style={{ transform: [{ scale: scaleAnim }] }}
                  >
                    <View className="px-6 py-7">
                      {/* Welcome Text */}
                      <View className="mb-6 items-center">
                        <Text className="mb-2 text-center text-3xl font-bold text-gray-900">
                          Welcome Back
                        </Text>
                        <Text className="text-center text-[15px] leading-5 text-gray-500">
                          Please enter your credentials to continue
                        </Text>
                      </View>

                      {/* Error Banner */}
                      {error ? (
                        <Animated.View 
                          className="mb-5 flex-row items-center rounded-xl border border-red-200 bg-red-50 p-4"
                          style={{ transform: [{ translateX: errorShake }] }}
                        >
                          <View className="w-1 h-12 bg-red-500 rounded-full mr-3" />
                          <Text className="flex-1 text-sm font-medium text-red-700 leading-relaxed">
                            {error}
                          </Text>
                        </Animated.View>
                      ) : null}

                      {/* Form Fields */}
                      <View className="gap-4">
                        {/* Username Input */}
                        <View>
                          <Text className="mb-2 ml-1 text-sm font-semibold text-gray-700">
                            Username
                          </Text>
                          <View 
                            className={`h-14 flex-row items-center rounded-xl border-2 px-4 transition-all duration-200 ${
                              focusedInput === "username" 
                                ? "border-[#E41F6A] bg-pink-50" 
                                : "border-gray-200 bg-gray-50"
                            }`}
                          >
                            <User 
                              size={22} 
                              color={focusedInput === "username" ? BRAND_PINK : "#9ca3af"} 
                              strokeWidth={1.5} 
                            />
                            <TextInput
                              value={loginForm.username}
                              onChangeText={(text) => setLoginForm((prev) => ({ ...prev, username: text }))}
                              onFocus={() => setFocusedInput("username")}
                              onBlur={() => setFocusedInput(null)}
                              placeholder="Enter your username"
                              className="ml-3 h-full flex-1 text-base text-gray-900"
                              placeholderTextColor="#9ca3af"
                              autoCapitalize="none"
                              autoCorrect={false}
                            />
                          </View>
                        </View>

                        {/* Password Input */}
                        <View>
                          <Text className="mb-2 ml-1 text-sm font-semibold text-gray-700">
                            Password
                          </Text>
                          <View 
                            className={`h-14 flex-row items-center rounded-xl border-2 px-4 transition-all duration-200 ${
                              focusedInput === "password" 
                                ? "border-[#E41F6A] bg-pink-50" 
                                : "border-gray-200 bg-gray-50"
                            }`}
                          >
                            <Lock 
                              size={22} 
                              color={focusedInput === "password" ? BRAND_PINK : "#9ca3af"} 
                              strokeWidth={1.5} 
                            />
                            <TextInput
                              value={loginForm.password}
                              onChangeText={(text) => setLoginForm((prev) => ({ ...prev, password: text }))}
                              onFocus={() => setFocusedInput("password")}
                              onBlur={() => setFocusedInput(null)}
                              secureTextEntry={!showPassword}
                              placeholder="Enter your password"
                              className="ml-3 h-full flex-1 text-base text-gray-900"
                              placeholderTextColor="#9ca3af"
                              autoCapitalize="none"
                            />
                            
                            <TouchableOpacity 
                              activeOpacity={0.7} 
                              onPress={() => setShowPassword(!showPassword)}
                              className="p-2 -mr-2"
                              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                              {showPassword ? (
                                <EyeOff size={22} color={focusedInput === "password" ? BRAND_PINK : "#9ca3af"} />
                              ) : (
                                <Eye size={22} color={focusedInput === "password" ? BRAND_PINK : "#9ca3af"} />
                              )}
                            </TouchableOpacity>
                          </View>
                        </View>

                        {/* Submit Button */}
                        <Animated.View style={{ transform: [{ scale: buttonScale }], marginTop: 8 }}>
                          <TouchableOpacity
                            onPress={handleLoginSubmit}
                            onPressIn={handleButtonPressIn}
                            onPressOut={handleButtonPressOut}
                            disabled={isSubmitting}
                            activeOpacity={0.9}
                          >
                            <View
                              className="h-14 flex-row items-center justify-center rounded-xl shadow-xl"
                              style={{
                                backgroundColor: BRAND_PINK,
                                shadowColor: BRAND_PINK,
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.4,
                                shadowRadius: 12,
                                elevation: 8,
                                opacity: isSubmitting ? 0.7 : 1,
                              }}
                            >
                              {isSubmitting ? (
                                <ActivityIndicator color="#fff" size="small" />
                              ) : (
                                <>
                                  <Text className="mr-3 text-lg font-bold text-white tracking-wide">
                                    Sign In
                                  </Text>
                                  <ArrowRight size={22} color="#fff" strokeWidth={2.5} />
                                </>
                              )}
                            </View>
                          </TouchableOpacity>
                        </Animated.View>
                      </View>
                    </View>
                  </Animated.View>

                </View>
              </Animated.View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
