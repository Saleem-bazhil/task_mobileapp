import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, MoreHorizontal, Send } from 'lucide-react-native';
import api from '../../api/Api';
import { getAccessToken } from '../../services/storage';

interface Message {
  id: number;
  text: string;
  sender: string;
  isMe: boolean;
  timestamp?: string;
}

interface User {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
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
  onMessagePersisted?: (message: any) => void;
}

const ChatWindow: React.FC<Props> = ({ conversation, currentUser, onMessagePersisted }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const ws = useRef<WebSocket | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const navigation = useNavigation<any>();

  const room = conversation?.room_id;
  const otherUser = conversation?.other_user;
  const displayName = otherUser?.first_name
    ? `${otherUser.first_name} ${otherUser.last_name || ''}`.trim()
    : otherUser?.username || 'Chat';

  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    if (!room) {
      setMessages([]);
      return;
    }

    api
      .get(`/api/chat/rooms/${room}/messages/`)
      .then((res) => {
        const data = res.data || [];
        const formatted: Message[] = data.map((message: any) => ({
          id: message.id || Math.random(),
          text: message.content || message.text,
          sender: message.sender?.username || message.sender,
          isMe:
            message.sender?.id === currentUser?.id ||
            message.sender?.username === currentUser?.username ||
            message.sender === currentUser?.username,
          timestamp: message.timestamp,
        }));
        setMessages(formatted);
      })
      .catch(console.error);
  }, [room, currentUser]);

  useEffect(() => {
    if (!room) return;

    let active = true;

    async function connectWebSocket() {
      try {
        const token = await getAccessToken();
        if (!active) return;

        const wsUrl = `ws://127.0.0.1:8000/ws/chat/${room}/${token ? `?token=${token}` : ''}`;
        const socket = new WebSocket(wsUrl);
        ws.current = socket;

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            setMessages((prev) => [
              ...prev,
              {
                id: data.id || Date.now(),
                text: data.content || data.message,
                sender: data.sender?.username || data.sender,
                isMe:
                  data.sender?.id === currentUser?.id ||
                  data.sender?.username === currentUser?.username ||
                  data.sender === currentUser?.username,
                timestamp: data.timestamp || new Date().toISOString(),
              },
            ]);

            if (onMessagePersisted) {
              onMessagePersisted({
                room_id: room,
                content: data.content || data.message,
                timestamp: data.timestamp || new Date().toISOString(),
              });
            }
          } catch (err) {
            console.error('Failed to parse websocket message', err);
          }
        };
      } catch (err) {
        console.error('Failed to get token for websocket', err);
      }
    }

    connectWebSocket();

    return () => {
      active = false;
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, [room, currentUser, onMessagePersisted]);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const sendMessage = () => {
    if (!messageText.trim()) return;

    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          message: messageText,
          sender: currentUser?.username || 'Me',
          sender_id: currentUser?.id,
        })
      );
    }

    setMessageText('');
  };

  if (!room) {
    return (
      <View className="flex-1 items-center justify-center rounded-[28px] bg-white p-6 shadow-lg">
        <Text className="text-xl font-bold text-slate-700">Select a conversation</Text>
        <Text className="mt-2 text-center text-sm leading-6 text-slate-500">
          Pick a chat from the list to start messaging.
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 rounded-[28px] bg-white shadow-lg"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-row items-center border-b border-slate-100 px-4 py-4">
        <Pressable
          onPress={() => navigation.goBack()}
          className="mr-3 h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 active:scale-95"
        >
          <ArrowLeft size={18} color="#334155" />
        </Pressable>
        <View className="mr-3 h-11 w-11 items-center justify-center rounded-2xl bg-pink-100">
          <Text className="text-lg font-bold text-pink-700">{displayName.charAt(0).toUpperCase()}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-slate-900">{displayName}</Text>
          <Text className="mt-1 text-sm text-slate-500">Live conversation</Text>
        </View>
        <Pressable className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 active:scale-95">
          <MoreHorizontal size={18} color="#334155" />
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        className="flex-1 bg-[#FFF9FB] px-4 py-4"
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            className={`mb-3 flex-row ${message.isMe ? 'justify-end' : 'justify-start'}`}
          >
            <View
              className={`max-w-[78%] rounded-[24px] px-4 py-3 ${
                message.isMe ? 'bg-pink-600 rounded-br-md' : 'bg-white rounded-bl-md'
              }`}
            >
              <Text className={`text-[15px] leading-6 ${message.isMe ? 'text-white' : 'text-slate-800'}`}>
                {message.text}
              </Text>
              <Text className={`mt-2 text-xs ${message.isMe ? 'text-white/75' : 'text-slate-400'}`}>
                {formatTime(message.timestamp)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View className="flex-row items-end border-t border-slate-100 px-4 py-4">
        <View className="flex-1 rounded-[24px] bg-slate-50 px-4 py-3">
          <TextInput
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Type a message"
            placeholderTextColor="#94A3B8"
            className="text-base text-slate-800"
            multiline
            style={{ maxHeight: 100 }}
          />
        </View>

        <Pressable
          onPress={sendMessage}
          disabled={!messageText.trim()}
          className={`ml-3 h-12 w-12 items-center justify-center rounded-2xl ${
            messageText.trim() ? 'bg-pink-600' : 'bg-slate-200'
          }`}
        >
          <Send size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatWindow;
