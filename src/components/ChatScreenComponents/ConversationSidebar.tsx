import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { Plus, X } from "lucide-react-native";

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
  currentUser: any;
  users: User[];
  conversations: Conversation[];
  activeRoomId: string | null;
  isCreatingRoom: boolean;
  mode: string; // 'inbox' | 'new'
  onModeChange: (mode: string) => void;
  onOpenConversation: (c: Conversation) => void;
  onCreateConversation: (u: User) => void;
  search: string;
  onSearchChange: (s: string) => void;
}

const ConversationSidebar: React.FC<Props> = ({
  currentUser,
  users,
  conversations,
  activeRoomId,
  isCreatingRoom,
  mode,
  onModeChange,
  onOpenConversation,
  onCreateConversation,
  search,
  onSearchChange,
}) => {
  const showNewChatList = mode === "new";

  const filteredConversations = conversations.filter(c =>
    c.other_user?.username?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.id !== currentUser?.id && u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="bg-white rounded-2xl border border-slate-200 flex-1">
      {/* HEADER */}
      <View className="p-4 border-b border-slate-200 flex-row justify-between items-center">
        <Text className="font-bold text-lg">
          {showNewChatList ? "Select User" : "Messages"}
        </Text>

        {showNewChatList ? (
          <Pressable onPress={() => onModeChange("inbox")}>
            <X size={20} color="#000" />
          </Pressable>
        ) : (
          <Pressable onPress={() => onModeChange("new")}>
            <Plus size={20} color="#000" />
          </Pressable>
        )}
      </View>

      {/* SEARCH */}
      <View className="p-3">
        <TextInput
          value={search}
          onChangeText={onSearchChange}
          placeholder="Search..."
          className="w-full border border-slate-300 p-2 rounded-lg"
        />
      </View>

      {/* LIST */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {showNewChatList ? (
          filteredUsers.length === 0 ? (
            <Text className="text-gray-400 text-center mt-4">No users found.</Text>
          ) : (
            filteredUsers.map(u => (
              <Pressable
                key={u.id}
                onPress={() => onCreateConversation(u)}
                disabled={isCreatingRoom}
                className="p-3 active:bg-gray-100 flex-row justify-between items-center"
              >
                <Text className="text-black font-medium">{u.username}</Text>
                {isCreatingRoom && <ActivityIndicator size="small" color="#aaa" />}
              </Pressable>
            ))
          )
        ) : (
          filteredConversations.length === 0 ? (
            <Text className="text-gray-400 text-center mt-4">No conversations yet.</Text>
          ) : (
            filteredConversations.map(c => (
              <Pressable
                key={c.room_id}
                onPress={() => onOpenConversation(c)}
                className={`p-3 border-b border-slate-100 ${
                  activeRoomId === c.room_id ? "bg-blue-50" : "bg-white"
                }`}
              >
                <Text className="font-semibold text-black">
                  {c.other_user?.username || "Unknown"}
                </Text>
                {c.last_message && (
                  <Text className="text-xs text-slate-500 mt-1" numberOfLines={1}>
                    {c.last_message.content || "..."}
                  </Text>
                )}
              </Pressable>
            ))
          )
        )}
      </ScrollView>
    </View>
  );
};

export default ConversationSidebar;