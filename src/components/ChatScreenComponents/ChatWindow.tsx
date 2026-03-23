import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  StyleSheet
} from "react-native";
import { Send, Phone, Video, MoreVertical } from "lucide-react-native";
import api from "../../api/Api"; 
import { getAccessToken } from "../../services/storage";

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
  const [messageText, setMessageText] = useState<string>("");
  const ws = useRef<WebSocket | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const room = conversation?.room_id;
  const otherUser = conversation?.other_user;
  const displayName = otherUser?.first_name 
    ? `${otherUser.first_name} ${otherUser.last_name || ''}`.trim() 
    : (otherUser?.username || "Chat");

  // Format time (e.g. 10:45 AM)
  const formatTime = (isoString?: string) => {
    if (!isoString) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // 📥 Fetch history
  useEffect(() => {
    if (!room) {
      setMessages([]);
      return;
    }

    api.get(`/api/chat/rooms/${room}/messages/`)
      .then(res => {
        const data = res.data || [];
        const formatted: Message[] = data.map((m: any) => ({
          id: m.id || Math.random(),
          text: m.content || m.text,
          sender: m.sender?.username || m.sender,
          isMe: (m.sender?.id === currentUser?.id) || (m.sender?.username === currentUser?.username) || (m.sender === currentUser?.username),
          timestamp: m.timestamp
        }));
        setMessages(formatted);
      })
      .catch(console.error);
  }, [room, currentUser]);

  // 🔌 WebSocket connecting directly to the Django Channels backend 
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
                isMe: (data.sender?.id === currentUser?.id) || (data.sender?.username === currentUser?.username) || (data.sender === currentUser?.username),
                timestamp: data.timestamp || new Date().toISOString()
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
    } else {
      console.warn("WebSocket is NOT connected. Call failed.");
    }

    setMessageText("");
  };

  if (!room) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f0f2f5] border-l border-slate-300">
        <View className="items-center max-w-[80%]">
          <Text className="mb-4 text-center text-2xl font-light text-slate-500">
            WhatsApp Web UI
          </Text>
          <Text className="text-gray-400 text-center">
            Select a chat from the sidebar to start messaging. 
            All messages are end-to-end encrypted (actually no, but it looks like it).
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-[#efeae2] border-l border-slate-300 relative"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* HEADER (WhatsApp Green / Teal) */}
      <View className="flex-row items-center px-4 py-3 bg-[#f0f2f5] border-b border-slate-200 shadow-sm z-10" style={styles.headerShadow}>
        <View className="w-10 h-10 rounded-full bg-slate-300 mr-3 overflow-hidden items-center justify-center">
          <Text className="text-white font-bold text-lg">
            {displayName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-[16px] text-slate-900 leading-tight">
            {displayName}
          </Text>
          <Text className="text-xs text-slate-500">
            online
          </Text>
        </View>

        <View className="flex-row items-center gap-6 pr-2">
          <Video size={20} color="#54656f" />
          <Phone size={18} color="#54656f" />
          <MoreVertical size={20} color="#54656f" />
        </View>
      </View>

      {/* MESSAGES */}
      <ScrollView
        ref={scrollRef}
        className="flex-1 px-4 py-2"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center my-2">
          <View className="bg-[#ffeecd] px-3 py-1.5 rounded-lg shadow-sm">
            <Text className="text-xs text-[#54656f] text-center">
              Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.
            </Text>
          </View>
        </View>

        {messages.map((m, index) => {
          const isNextSameSender = index < messages.length - 1 && messages[index+1].isMe === m.isMe;
          
          return (
            <View
              key={m.id}
              className={`mb-1 flex-row ${m.isMe ? "justify-end" : "justify-start"}`}
            >
              <View
                className={`px-3 pt-2 pb-1.5 max-w-[75%] shadow-sm ${
                  m.isMe
                    ? "bg-[#dcf8c6] rounded-xl rounded-tr-none"
                    : "bg-white rounded-xl rounded-tl-none"
                }`}
                style={styles.bubbleShadow}
              >
                {!m.isMe && (m.sender !== otherUser?.username) && (
                  <Text className="font-bold text-[12px] text-emerald-600 mb-0.5">
                    {m.sender}
                  </Text>
                )}
                
                <View className="flex-row flex-wrap items-end relative">
                  <Text className="text-[#111b21] text-[15px] leading-5 pr-12 pb-1">
                    {m.text}
                  </Text>
                  
                  <View className="absolute right-0 bottom-0 flex-row items-center">
                    <Text className="text-[#667781] text-[10px]">
                      {formatTime(m.timestamp)}
                    </Text>
                    {/* If isMe, we could add double blue ticks here */}
                  </View>
                </View>
              </View>
            </View>
          );
        })}
        {/* Extra padding at the bottom so last message isn't hidden by input bare */}
        <View className="h-4" />
      </ScrollView>

      {/* INPUT BAR */}
      <View className="flex-row items-end px-2 py-2.5 bg-[#f0f2f5]">
        <View className="flex-1 bg-white rounded-3xl flex-row items-center px-4 py-1.5 shadow-sm min-h-[44px]">
          <TextInput
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Type a message"
            placeholderTextColor="#8696a0"
            className="flex-1 text-[16px] text-slate-800 "
            multiline
            style={{ maxHeight: 100 }}
            onSubmitEditing={sendMessage}
          />
        </View>

        <Pressable
          onPress={sendMessage}
          className="bg-[#00a884] w-12 h-12 rounded-full items-center justify-center ml-2 shadow-sm active:bg-[#008f6f]"
          disabled={!messageText.trim()}
        >
          <Send size={20} color="white" style={{ marginLeft: -2, marginTop: 2 }} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  headerShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  bubbleShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 1,
  }
});

export default ChatWindow;
