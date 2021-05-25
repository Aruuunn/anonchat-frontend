import { ChatInterface } from './chat.interface';
import { MessageInterface } from './message.interface';
import { ChatType } from '../chat-type.enum';

export interface ChatStorageInterface {
  getTotalChatsCount(): Promise<number>;
  chatAtIndex(index: number): Promise<ChatInterface | undefined>;
  createNewChat(chatData: ChatInterface): Promise<void>;
  clear(): Promise<void>;
  getTotalMessageCount(chatId: string): Promise<number>;
  messageAtIndex(
    chatID: string,
    index: number
  ): Promise<MessageInterface | undefined>;
  addNewMessage(message: MessageInterface): Promise<void>;
  getLastMessage(chatId: string): Promise<MessageInterface | undefined>;
  getNumberOfUnreadMessages(chatId: string): Promise<number>;
  updateChat(chat: ChatInterface): Promise<void>;
  getChatUsingId(chatId: string): Promise<ChatInterface | undefined>;
  getMessageUsingId(messageId: string): Promise<MessageInterface | undefined>;
  updateMessage(message: MessageInterface): Promise<void>;
  deleteChat(chatId: string): Promise<void>;
  deleteMessage(messageId: string): Promise<void>;
}
