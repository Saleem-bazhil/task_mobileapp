import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { ArrowLeft, Edit3, MessageCircleMore, Search } from 'lucide-react-native';

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
  mode: string;
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
  const showNewChatList = mode === 'new';

  const getDisplayName = (u?: User) => {
    if (!u) return 'Unknown';
    return u.first_name ? `${u.first_name} ${u.last_name || ''}`.trim() : u.username;
  };

  const formatShortTime = (value?: string | number | Date) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const filteredConversations = conversations.filter((conversation) =>
    getDisplayName(conversation.other_user).toLowerCase().includes(search.toLowerCase())
  );
  const filteredUsers = users.filter(
    (user) => user.id !== currentUser?.id && getDisplayName(user).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="flex-1 rounded-[28px] bg-white p-5 shadow-lg">
      <View className="mb-4 flex-row items-center justify-between">
        {showNewChatList ? (
          <>
            <View className="flex-row items-center flex-1">
              <Pressable
                onPress={() => onModeChange('inbox')}
                className="mr-3 h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 active:scale-95"
              >
                <ArrowLeft size={18} color="#334155" />
              </Pressable>
              <View className="flex-1">
                <Text className="text-sm font-semibold uppercase tracking-[1.4px] text-pink-700">New Chat</Text>
                <Text className="mt-1 text-xl font-extrabold text-slate-900">{filteredUsers.length} contacts</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <View className="flex-1">
              <Text className="text-xs font-semibold uppercase tracking-[1.4px] text-pink-700">Messaging</Text>
              <Text className="mt-2 text-2xl font-extrabold text-slate-900">Chats</Text>
            </View>
            <Pressable
              onPress={() => onModeChange('new')}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 active:scale-95"
            >
              <Edit3 size={18} color="#E41F6A" />
            </Pressable>
          </>
        )}
      </View>

      <View className="mb-4 flex-row items-center rounded-2xl bg-slate-50 px-4 py-3">
        <Search size={18} color="#94A3B8" />
        <TextInput
          value={search}
          onChangeText={onSearchChange}
          placeholder={showNewChatList ? 'Search contacts' : 'Search conversations'}
          placeholderTextColor="#94A3B8"
          className="ml-3 flex-1 text-base text-slate-800"
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {showNewChatList ? (
          <View className="gap-3">
            {filteredUsers.length === 0 ? (
              <View className="items-center rounded-[24px] bg-slate-50 px-5 py-10">
                <Text className="text-center text-sm leading-6 text-slate-500">No contacts found.</Text>
              </View>
            ) : (
              filteredUsers.map((user) => (
                <Pressable
                  key={user.id}
                  onPress={() => onCreateConversation(user)}
                  disabled={isCreatingRoom}
                  className="flex-row items-center rounded-[24px] bg-slate-50 px-4 py-4 active:scale-95"
                >
                  <View className="mr-4 h-12 w-12 items-center justify-center rounded-2xl bg-pink-100">
                    <Text className="text-lg font-bold text-pink-700">
                      {getDisplayName(user).charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-slate-900">{getDisplayName(user)}</Text>
                    <Text className="mt-1 text-sm text-slate-500">Available to chat</Text>
                  </View>
                  {isCreatingRoom ? <ActivityIndicator size="small" color="#E41F6A" /> : null}
                </Pressable>
              ))
            )}
          </View>
        ) : (
          <View className="gap-3">
            {filteredConversations.length === 0 ? (
              <View className="items-center rounded-[24px] bg-slate-50 px-5 py-10">
                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white">
                  <MessageCircleMore size={24} color="#CBD5E1" />
                </View>
                <Text className="mt-4 text-lg font-semibold text-slate-700">No chats yet</Text>
                <Text className="mt-2 text-center text-sm leading-6 text-slate-500">
                  Start a new conversation to begin messaging from this workspace.
                </Text>
              </View>
            ) : (
              filteredConversations.map((conversation) => {
                const isSelected = activeRoomId === conversation.room_id;
                const name = getDisplayName(conversation.other_user);

                return (
                  <Pressable
                    key={conversation.room_id}
                    onPress={() => onOpenConversation(conversation)}
                    className={`rounded-[24px] px-4 py-4 active:scale-95 ${
                      isSelected ? 'bg-pink-50' : 'bg-slate-50'
                    }`}
                  >
                    <View className="flex-row items-center">
                      <View className="mr-4 h-12 w-12 items-center justify-center rounded-2xl bg-slate-200">
                        <Text className="text-lg font-bold text-slate-700">{name.charAt(0).toUpperCase()}</Text>
                      </View>
                      <View className="flex-1 pr-3">
                        <View className="flex-row items-center justify-between">
                          <Text className="flex-1 text-base font-semibold text-slate-900" numberOfLines={1}>
                            {name}
                          </Text>
                          <Text className="ml-3 text-xs font-medium text-slate-400">
                            {formatShortTime(conversation.updated_at)}
                          </Text>
                        </View>
                        <Text className="mt-1 text-sm text-slate-500" numberOfLines={1}>
                          {conversation.last_message?.content || 'No messages yet'}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ConversationSidebar;
