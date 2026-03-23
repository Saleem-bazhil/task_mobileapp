import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView
} from "react-native";

interface Message {
  id: number;
  text: string;
  sender: string;
  isMe: boolean;
}

interface Props {
  room: string | null;
  currentUser: string;
}

const ChatWindow: React.FC<Props> = ({ room, currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const ws = useRef<WebSocket | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const BASE = "http://127.0.0.1:8000";

  // 📥 Fetch history
  useEffect(() => {
    if (!room) return;

    fetch(`${BASE}/api/messages/${room}/`)
      .then(res => res.json())
      .then(data => {
        const formatted: Message[] = data.map((m: any) => ({
          id: m.id,
          text: m.content,
          sender: m.sender,
          isMe: m.sender === currentUser
        }));
        setMessages(formatted);
      });
  }, [room, currentUser]);

  // 🔌 WebSocket
  useEffect(() => {
    if (!room) return;

    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${room}/`);
    ws.current = socket;

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);

      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          text: data.message,
          sender: data.sender,
          isMe: data.sender === currentUser
        }
      ]);
    };

    return () => socket.close();
  }, [room, currentUser]);

  // 🔽 scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // 📤 send message
  const sendMessage = () => {
    if (!message.trim()) return;

    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        message,
        sender: currentUser
      }));
    }

    setMessage("");
  };

  // ❌ No room selected
  if (!room) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-400">
          Select a chat to start messaging
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white rounded-2xl border border-slate-200">

      {/* HEADER */}
      <View className="p-4 border-b border-slate-200">
        <Text className="font-bold text-lg">{room}</Text>
      </View>

      {/* MESSAGES */}
      <ScrollView
        ref={scrollRef}
        className="flex-1 bg-gray-50 p-4"
        showsVerticalScrollIndicator={false}
      >
        {messages.map((m) => (
          <View
            key={m.id}
            className={`mb-2 ${m.isMe ? "items-end" : "items-start"}`}
          >
            <View
              className={`px-3 py-2 rounded-lg max-w-[80%] ${
                m.isMe
                  ? "bg-blue-500"
                  : "bg-white border border-slate-200"
              }`}
            >
              <Text className="font-semibold text-xs text-gray-600">
                {m.sender}
              </Text>
              <Text className={m.isMe ? "text-white" : "text-black"}>
                {m.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* INPUT */}
      <View className="p-3 flex-row gap-2 border-t border-slate-200">
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type message..."
          className="flex-1 border border-slate-300 p-2 rounded-lg"
          onSubmitEditing={sendMessage}
        />

        <Pressable
          onPress={sendMessage}
          className="bg-blue-500 px-4 rounded-lg items-center justify-center"
        >
          <Text className="text-white">Send</Text>
        </Pressable>
      </View>

    </View>
  );
};

export default ChatWindow;