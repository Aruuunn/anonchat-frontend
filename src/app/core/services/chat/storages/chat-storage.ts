import Dexie from 'dexie';
import { ChatStorageInterface } from '../interfaces/chat-storage.interface';
import { ChatInterface } from '../interfaces/chat.interface';
import { Injectable } from '@angular/core';
import { MessageInterface } from '../interfaces/message.interface';

export const CHAT_STORAGE_INJECTION_TOKEN = Symbol(
  'CHAT_STORAGE_INJECTION_TOKEN'
);

@Injectable({
  providedIn: 'root',
})
export class ChatStorage extends Dexie implements ChatStorageInterface {
  chats: Dexie.Table<ChatInterface, string>;
  messages: Dexie.Table<MessageInterface, string>;

  constructor() {
    super('ChatStorage');
    this.version(1).stores({
      chats: 'id, lastUpdatedAt',
      messages: 'id, timeStamp, chatId',
    });

    this.chats = this.table('chats');
    this.messages = this.table('messages');
  }

  getTotalChatsCount(): Promise<number> {
    return this.chats.count();
  }

  chatAtIndex(index: number): Promise<ChatInterface | undefined> {
    return this.chats.orderBy('lastUpdatedAt').offset(index).first();
  }

  async createNewChat(chatData: ChatInterface): Promise<void> {
    await this.chats.add(chatData);
  }

  async clear(): Promise<void> {
    await this.chats.clear();
    await this.messages.clear();
  }

  getTotalMessageCount(chatId: string): Promise<number> {
    return this.messages.where('chatId').equals(chatId).count();
  }

  messageAtIndex(
    chatID: string,
    index: number
  ): Promise<MessageInterface | undefined> {
    return this.messages.where('chatId').equals(chatID).offset(index).first();
  }

  async addNewMessage(message: MessageInterface): Promise<void> {
    console.log({ message });
    await this.messages.add(message);
  }

  getLastMessage(chatId: string): Promise<MessageInterface | undefined> {
    return this.messages.where('chatId').equals(chatId).last();
  }

  getNumberOfUnreadMessages(chatId: string): Promise<number> {
    return this.messages
      .where('chatId')
      .equals(chatId)
      .filter((message) => !message.read)
      .count();
  }

  async updateChat(chat: ChatInterface): Promise<void> {
    await this.chats.put(chat);
  }

  async getChatUsingId(chatId: string): Promise<ChatInterface | undefined> {
    return this.chats.where('id').equals(chatId).first();
  }

  async updateMessage(message: MessageInterface): Promise<void> {
    await this.messages.put(message);
  }

  async deleteChat(chatId: string): Promise<void> {
    await this.chats.where('id').equals(chatId).delete();
  }

  async deleteMessage(messageId: string): Promise<void> {
    await this.messages.where('id').equals(messageId).delete();
  }

  getMessageUsingId(messageId: string): Promise<MessageInterface | undefined> {
    return this.messages.where('id').equals(messageId).first();
  }
}
