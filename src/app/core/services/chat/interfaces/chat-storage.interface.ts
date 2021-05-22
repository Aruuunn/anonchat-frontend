import { ChatInterface } from './chat.interface';

export interface ChatStorageInterface {
  getTotalChatsCount(): Promise<number>;
  chatAtIndex(index: number): Promise<ChatInterface | undefined>;
  createNewChat(chatData: ChatInterface): Promise<void>;
  clear(): Promise<void>;
}
