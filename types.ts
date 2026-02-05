
export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  type?: 'text' | 'image' | 'video';
  mediaUrl?: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}
