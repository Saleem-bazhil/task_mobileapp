import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatList from '../screens/ChatList';
import ChatRoom from '../screens/ChatRoom';

export type ChatStackParamList = {
  ChatList: undefined;
  ChatRoom: {
    conversation: any;
  };
};

const Stack = createNativeStackNavigator<ChatStackParamList>();

const ChatStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="ChatList"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ChatList" component={ChatList} />
      <Stack.Screen name="ChatRoom" component={ChatRoom} />
    </Stack.Navigator>
  );
};

export default ChatStack;
