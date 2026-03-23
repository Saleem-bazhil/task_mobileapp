import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { Search, Edit3, ArrowLeft } from "lucide-react-native";

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

  const getDisplayName = (u?: User) => {
    if (!u) return "Unknown";
    return u.first_name ? `${u.first_name} ${u.last_name || ''}`.trim() : u.username;
  };

  const formatShortTime = (isoString?: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    
    const now = new Date();
    const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    const isYesterday = new Date(now.getTime() - 86400000).getDate() === date.getDate();

    if (isToday) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (isYesterday) return "Yesterday";
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const filteredConversations = conversations.filter(c =>
    getDisplayName(c.other_user).toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.id !== currentUser?.id && getDisplayName(u).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="bg-white flex-1 flex-col">
      {/* HEADER */}
      <View className="px-4 py-3 bg-white flex-row justify-between items-center h-[56px]">
        {showNewChatList ? (
          <View className="flex-row items-center">
            <Pressable onPress={() => onModeChange("inbox")} className="mr-3">
              <ArrowLeft size={24} color="#008069" />
            </Pressable>
            <View>
              <Text className="font-semibold text-[19px] text-[#111b21]">New Chat</Text>
              <Text className="text-xs text-[#54656f]">{filteredUsers.length} contacts</Text>
            </View>
          </View>
        ) : (
          <>
            <Text className="font-bold text-[22px] text-[#111b21]">Chats</Text>
            <View className="flex-row gap-4 items-center">
              <Pressable onPress={() => onModeChange("new")}>
                <Edit3 size={22} color="#54656f" />
              </Pressable>
            </View>
          </>
        )}
      </View>

      {/* SEARCH */}
      <View className="px-3 pb-2 pt-1 bg-white border-b border-gray-100">
        <View className="flex-row items-center bg-[#f0f2f5] rounded-xl px-3 h-9">
          <Search size={18} color="#54656f" />
          <TextInput
            value={search}
            onChangeText={onSearchChange}
            placeholder={showNewChatList ? "Search name or number" : "Search or start new chat"}
            placeholderTextColor="#8696a0"
            className="flex-1 ml-3 text-[15px] text-[#111b21] pb-1.5 pt-1.5"
          />
        </View>
      </View>

      {/* LIST */}
      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        {showNewChatList ? (
          <>
            <Text className="px-4 py-3 text-sm font-medium text-[#008069] tracking-widest">
              CONTACTS ON WHATSAPP
            </Text>
            {filteredUsers.length === 0 ? (
              <Text className="text-[#8696a0] text-center mt-6 text-base">No contacts found.</Text>
            ) : (
              filteredUsers.map(u => (
                <Pressable
                  key={u.id}
                  onPress={() => onCreateConversation(u)}
                  disabled={isCreatingRoom}
                  className="flex-row items-center px-4 py-3 active:bg-[#f5f6f6]"
                >
                  <View className="w-12 h-12 rounded-full bg-slate-200 justify-center items-center mr-4">
                    <Text className="text-[#54656f] font-semibold text-lg">{getDisplayName(u).charAt(0).toUpperCase()}</Text>
                  </View>
                  <View className="flex-1 border-b border-[#f0f2f5] pb-3 pt-1">
                    <Text className="text-[17px] text-[#111b21]">{getDisplayName(u)}</Text>
                    <Text className="text-[14px] text-[#54656f] mt-0.5" numberOfLines={1}>Available</Text>
                  </View>
                  {isCreatingRoom && <ActivityIndicator size="small" color="#008069" />}
                </Pressable>
              ))
            )}
          </>
        ) : (
          <>
            <View className="flex-row items-center py-2 px-4 border-b border-gray-100">
              <Text className="text-[#54656f] text-sm flex-1 font-medium">Archive</Text>
            </View>
            {filteredConversations.length === 0 ? (
              <Text className="text-[#8696a0] text-center mt-12 text-[15px]">No chats yet. Click the edit icon to start a new chat.</Text>
            ) : (
              filteredConversations.map(c => {
                const isSelected = activeRoomId === c.room_id;
                const lastMsgText = c.last_message?.content || "";
                
                return (
                  <Pressable
                    key={c.room_id}
                    onPress={() => onOpenConversation(c)}
                    className={`flex-row px-3 active:bg-[#f5f6f6] ${isSelected ? "bg-[#f0f2f5]" : "bg-white"}`}
                  >
                    <View className="py-3 pr-3">
                      <View className="w-12 h-12 rounded-full bg-slate-300 justify-center items-center">
                        <Text className="text-white font-bold text-xl">
                          {getDisplayName(c.other_user).charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    
                    <View className="flex-1 py-3 justify-center border-b border-[#f0f2f5]">
                      <View className="flex-row justify-between items-center mb-0.5">
                        <Text className="font-normal text-[17px] text-[#111b21] flex-1 mr-2" numberOfLines={1}>
                          {getDisplayName(c.other_user)}
                        </Text>
                        <Text className={`text-[12px] ${isSelected ? 'text-[#111b21]' : 'text-[#8696a0]'}`}>
                          {formatShortTime(c.updated_at as string)}
                        </Text>
                      </View>
                      
                      <View className="flex-row items-center">
                        {c.last_message && c.last_message.sender?.username === currentUser?.username ? (
                          <Text className="mr-1 text-[12px] text-[#53bdeb]">Seen</Text>
                        ) : null}
                        <Text className="text-[14px] text-[#54656f] flex-1" numberOfLines={1}>
                          {lastMsgText}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default ConversationSidebar;
