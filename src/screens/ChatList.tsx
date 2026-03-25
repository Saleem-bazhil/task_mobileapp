import React, { startTransition, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import ConversationSidebar from '../components/ChatScreenComponents/ConversationSidebar';
import { useAuth } from '../context/useAuth';
import { useBottomTabs } from '../navigation/BottomTabs';
import { fetchConversations, fetchUsers, getOrCreateRoom } from '../services/chat';
import { ChatStackParamList } from '../navigation/ChatStack';
import Header from '../components/Header';

type ChatListNavigationProp = NativeStackNavigationProp<ChatStackParamList, 'ChatList'>;

interface Conversation {
  room_id: string;
  id?: number;
  other_user?: any;
  last_message?: any;
  updated_at: string | number | Date;
}

interface User {
  id: number;
  username: string;
}

function sortByMostRecent(items: Conversation[]) {
  return [...items].sort(
    (left, right) => new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime()
  );
}

const ChatList: React.FC = () => {
  const { user } = useAuth();
  const { pendingChatTarget, setPendingChatTarget } = useBottomTabs();
  const navigation = useNavigation<ChatListNavigationProp>();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState('inbox');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [pageError, setPageError] = useState('');

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      async function loadSidebarData() {
        try {
          const [conversationResponse, usersResponse] = await Promise.all([
            fetchConversations(),
            fetchUsers(),
          ]);

          if (cancelled) return;

          setConversations(sortByMostRecent(conversationResponse));
          setUsers(usersResponse);
          setPageError('');
        } catch {
          if (!cancelled) {
            setPageError("We couldn't load your chat directory. Please refresh.");
          }
        }
      }

      loadSidebarData();

      return () => {
        cancelled = true;
      };
    }, [])
  );

  const handleCreateConversation = useCallback(async (selectedUser: User) => {
    setIsCreatingRoom(true);

    try {
      const room = await getOrCreateRoom(selectedUser.id);
      const existingConversation = conversations.find(
        (conversation) => conversation.room_id === room.room_id
      );

      const nextConversation =
        existingConversation || {
          room_id: room.room_id,
          id: room.id,
          other_user: selectedUser,
          last_message: null,
          updated_at: room.updated_at,
        };

      startTransition(() => {
        setMode('inbox');
        setSearch('');
        setPageError('');
        navigation.navigate('ChatRoom', { conversation: nextConversation });
      });
    } catch {
      setPageError('Unable to open that conversation right now.');
    } finally {
      setIsCreatingRoom(false);
    }
  }, [conversations, navigation]);

  useEffect(() => {
    if (!pendingChatTarget || isCreatingRoom) {
      return;
    }

    const normalizedUsername = pendingChatTarget.username?.toLowerCase();
    const existingConversation = conversations.find(
      (conversation) =>
        (pendingChatTarget.userId != null &&
          conversation.other_user?.id === pendingChatTarget.userId) ||
        (normalizedUsername != null &&
          conversation.other_user?.username?.toLowerCase() === normalizedUsername)
    );

    if (existingConversation) {
      setPendingChatTarget(null);
      navigation.navigate('ChatRoom', { conversation: existingConversation });
      return;
    }

    const matchedUser = users.find(
      (chatUser) =>
        (pendingChatTarget.userId != null && chatUser.id === pendingChatTarget.userId) ||
        (normalizedUsername != null && chatUser.username?.toLowerCase() === normalizedUsername)
    );

    if (!matchedUser) {
      if (users.length > 0) {
        setPendingChatTarget(null);
        setPageError('We could not find that assigned user in chat right now.');
      }
      return;
    }

    setPendingChatTarget(null);
    handleCreateConversation(matchedUser);
  }, [
    conversations,
    handleCreateConversation,
    isCreatingRoom,
    navigation,
    pendingChatTarget,
    setPendingChatTarget,
    users,
  ]);

  return (
    <View className="flex-1 bg-[#FFF6FA]">
      <Header title="Messages" />
      <View className="flex-1 px-5 pt-4">
      {pendingChatTarget ? (
        <View className="mb-4 flex-row items-center rounded-2xl bg-white px-4 py-3 shadow-lg">
          <ActivityIndicator size="small" color="#E41F6A" />
          <Text className="ml-3 text-sm font-medium text-slate-600">
            Opening assignee conversation...
          </Text>
        </View>
      ) : null}

      {pageError ? (
        <View className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
          <Text className="text-sm font-medium text-rose-700">{pageError}</Text>
        </View>
      ) : null}

      <ConversationSidebar
        currentUser={user}
        users={users}
        conversations={conversations}
        activeRoomId={null}
        isCreatingRoom={isCreatingRoom}
        mode={mode}
        onModeChange={setMode}
        onOpenConversation={(conversation) => navigation.navigate('ChatRoom', { conversation })}
        onCreateConversation={handleCreateConversation}
        search={search}
        onSearchChange={setSearch}
      />
      </View>
    </View>
  );
};

export default ChatList;
