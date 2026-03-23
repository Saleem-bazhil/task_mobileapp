import api from "../api/Api";

// Define basic response types (you can expand later)
type User = any;
type Conversation = any;
type Message = any;
type Room = any;

// Fetch Users
export async function fetchUsers(): Promise<User[]> {
  const response = await api.get<User[]>("/api/chat/users/");
  return response.data;
}

// Fetch Conversations
export async function fetchConversations(): Promise<Conversation[]> {
  const response = await api.get<Conversation[]>("/api/chat/conversations/");
  return response.data;
}

// Fetch Messages
export async function fetchMessages(roomId: number | string): Promise<Message[]> {
  const response = await api.get<Message[]>(
    `/api/chat/rooms/${roomId}/messages/`
  );
  return response.data;
}

// Get or Create Room
export async function getOrCreateRoom(userId: number | string): Promise<Room> {
  const response = await api.post<Room>("/api/chat/rooms/", {
    user_id: userId,
  });
  return response.data;
}