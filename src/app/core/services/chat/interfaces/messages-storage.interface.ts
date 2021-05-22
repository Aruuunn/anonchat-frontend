import { MessageInterface } from './message.interface';

export interface MessagesStorageInterface {
  getTotalMessageCount(chatId: string): Promise<number>;
  messageAtIndex(
    chatID: string,
    index: number
  ): Promise<MessageInterface | undefined>;
  addNewMessage(message: MessageInterface): Promise<void>;
  clear(): Promise<void>;
}
