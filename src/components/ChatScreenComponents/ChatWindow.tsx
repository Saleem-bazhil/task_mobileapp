import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";

import api from "../../api/Api";
import { getAccessToken } from "../../services/storage";

interface Message {
  id: number;
  text: string;
  sender: string;
  isMe: boolean;
}

interface User {
  id: number;
  username: string;
}

interface Conversation {
  room_id: string;
  id?: number;
  other_user?: User;
  last_message?: any;
  updated_at: string | number | Date;
}

interface Props {
  conversation: Conversation | null;
  currentUser: any;
  onMessagePersisted: (message: any) => void;
}

const ChatWindow: React.FC<Props> = ({ conversation, currentUser, onMessagePersisted }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState<string>("");
  const ws = useRef<WebSocket | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const room = conversation?.room_id;

  // 📥 Fetch history
  useEffect(() => {
    if (!room) {
      setMessages([]);
      return;
    }

    // Using the REST API to get existing messages for the room
    api.get(`/api/chat/rooms/${room}/messages/`)
      .then(res => {
        const data = res.data || [];
        const formatted: Message[] = data.map((m: any) => ({
          id: m.id || Math.random(),
          text: m.content || m.text,
          sender: m.sender?.username || m.sender,
          isMe: (m.sender?.id === currentUser?.id) || (m.sender === currentUser?.username)
        }));
        setMessages(formatted);
      })
      .catch(console.error);
  }, [room, currentUser]);

  // 🔌 WebSocket connecting directly to the Django Channels backend or equivalent
  useEffect(() => {
    if (!room) return;

    let active = true;

    const connectWebSocket = async () => {
      try {
        const token = await getAccessToken();
        if (!active) return;

        // Pass token in URL query for Django Channels JwtAuthMiddleware
        const wsUrl = `ws://127.0.0.1:8000/ws/chat/${room}/${token ? `?token=${token}` : ''}`;
        const socket = new WebSocket(wsUrl);
        ws.current = socket;

        socket.onopen = () => {
          console.log('Connected to chat room:', room);
        };

        socket.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);

            setMessages(prev => [
              ...prev,
              {
                id: data.id || Date.now(),
                text: data.content || data.message,
                sender: data.sender?.username || data.sender,
                isMe: (data.sender?.id === currentUser?.id) || (data.sender?.username === currentUser?.username) || (data.sender === currentUser?.username)
              }
            ]);

            // Notify parent to update the conversation list snippet
            if (onMessagePersisted) {
              onMessagePersisted({
                room_id: room,
                content: data.content || data.message,
                timestamp: data.timestamp || new Date().toISOString()
              });
            }
          } catch (err) {
            console.error("Failed to parse websocket message", err);
          }
        };

        socket.onclose = () => {
          console.log('Chat socket closed');
        };
      } catch (err) {
        console.error("Failed to get token for websocket", err);
      }
    };

    connectWebSocket();

    return () => {
      active = false;
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, [room, currentUser, onMessagePersisted]);

  // 🔽 scroll to bottom
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  // 📤 send message
  const sendMessage = () => {
    if (!messageText.trim()) return;

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        message: messageText,
        sender: currentUser?.username || "Me",
        sender_id: currentUser?.id
      }));

      // Some backends echo the message back to sender, some don't.
      // If the backend doesn't echo, we'd need to add it optimistically here.
      // Assuming it echoes for now (standard channels tutorial implementation).
    }

    setMessageText("");
  };

  if (!room) {
    return (
      <View className="flex-1 items-center justify-center bg-white rounded-2xl border border-slate-200">
        <Text className="text-gray-400">
          Select a chat to start messaging
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white rounded-2xl border border-slate-200"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* HEADER */}
      <View className="p-4 border-b border-slate-200">
        <Text className="font-bold text-lg">
          {conversation.other_user?.username || "Chat"}
        </Text>
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
              className={`px-3 py-2 rounded-lg max-w-[80%] ${m.isMe
                ? "bg-blue-500"
                : "bg-white border border-slate-200"
                }`}
            >
              {!m.isMe && (
                <Text className="font-semibold text-xs text-gray-400 mb-1">
                  {m.sender}
                </Text>
              )}
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
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          className="flex-1 border border-slate-300 px-4 py-2 rounded-full"
          onSubmitEditing={sendMessage}
        />

        <Pressable
          onPress={sendMessage}
          className="bg-blue-500 px-5 rounded-full items-center justify-center active:bg-blue-600"
        >
          <Text className="text-white font-semibold">Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatWindow;