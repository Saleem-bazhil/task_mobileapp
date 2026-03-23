import React, { startTransition, useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";

import ChatPanel from "../components/ChatScreenComponents/ChatWindow";
import ConversationSidebar from "../components/ChatScreenComponents/ConversationSidebar";
import { useAuth } from "../context/useAuth";
import {
  fetchConversations,
  fetchUsers,
  getOrCreateRoom
} from "../services/chat";

// Types
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

// Sort function
function sortByMostRecent(items: Conversation[]): Conversation[] {
  return [...items].sort(
    (left, right) =>
      new Date(right.updated_at).getTime() -
      new Date(left.updated_at).getTime()
  );
}

const Chat: React.FC = () => {
  const { user } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [search, setSearch] = useState<string>("");
  const [mode, setMode] = useState<string>("inbox");
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>(false);
  const [pageError, setPageError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function loadSidebarData() {
      try {
        const [conversationResponse, usersResponse] =
          await Promise.all([fetchConversations(), fetchUsers()]);

        if (cancelled) return;

        const sortedConversations =
          sortByMostRecent(conversationResponse);

        setConversations(sortedConversations);
        setUsers(usersResponse);
        setActiveConversation(
          (current) => current || sortedConversations[0] || null
        );
        setPageError("");
      } catch {
        if (!cancelled) {
          setPageError(
            "We couldn't load your chat directory. Please refresh."
          );
        }
      }
    }

    loadSidebarData();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreateConversation = async (selectedUser: User) => {
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
          updated_at: room.updated_at
        };

      startTransition(() => {
        setConversations((current) => {
          if (
            current.some(
              (conversation) =>
                conversation.room_id === nextConversation.room_id
            )
          ) {
            return current;
          }
          return [nextConversation, ...current];
        });

        setActiveConversation(nextConversation);
        setMode("inbox");
        setSearch("");
        setPageError("");
      });
    } catch {
      setPageError("Unable to open that conversation right now.");
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const handleMessagePersisted = (message: any) => {
    startTransition(() => {
      setConversations((current) => {
        const targetConversation = current.find(
          (conversation) => conversation.room_id === message.room_id
        );

        if (!targetConversation) return current;

        const updatedConversation = {
          ...targetConversation,
          last_message: message,
          updated_at: message.timestamp
        };

        return sortByMostRecent([
          updatedConversation,
          ...current.filter(
            (conversation) =>
              conversation.room_id !== message.room_id
          )
        ]);
      });
    });
  };

  return (
    <View className="flex-1 bg-slate-50 px-4 py-5">

      <View className="flex-1 gap-5">

        {/* Sidebar */}
        <View className="h-[40%]">
          <ConversationSidebar
            currentUser={user}
            users={users}
            conversations={conversations}
            activeRoomId={activeConversation?.room_id || null}
            isCreatingRoom={isCreatingRoom}
            mode={mode}
            onModeChange={setMode}
            onOpenConversation={(conversation: Conversation) => {
              setActiveConversation(conversation);
              setMode("inbox");
            }}
            onCreateConversation={handleCreateConversation}
            search={search}
            onSearchChange={setSearch}
          />
        </View>

        {/* Chat Panel */}
        <View className="flex-1">

          {pageError ? (
            <View className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
              <Text className="text-sm text-rose-700">
                {pageError}
              </Text>
            </View>
          ) : null}

          <ChatPanel
            key={activeConversation?.room_id || "empty-room"}
            conversation={activeConversation}
            currentUser={user}
            onMessagePersisted={handleMessagePersisted}
          />
        </View>

      </View>

    </View>
  );
};

export default Chat;