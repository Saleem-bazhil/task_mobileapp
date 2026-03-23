import React from "react";
import { View } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";

import ChatPanel from "../components/ChatScreenComponents/ChatWindow";
import { useAuth } from "../context/useAuth";
import { ChatStackParamList } from "../navigation/ChatStack";

type ChatRoomRouteProp = RouteProp<ChatStackParamList, 'ChatRoom'>;

const ChatRoom: React.FC = () => {
  const { user } = useAuth();
  const route = useRoute<ChatRoomRouteProp>();
  const { conversation } = route.params;

  return (
    <View className="flex-1 bg-white">
      <ChatPanel
        conversation={conversation}
        currentUser={user}
      />
    </View>
  );
};

export default ChatRoom;
