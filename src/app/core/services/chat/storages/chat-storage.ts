import { ChatStorageInterface } from '../interfaces/chat-storage.interface';
import Dexie from 'dexie';
import { ChatInterface } from '../interfaces/chat.interface';
import { Injectable } from '@angular/core';

export const CHAT_STORAGE_INJECTION_TOKEN = Symbol(
  'CHAT_STORAGE_INJECTION_TOKEN'
);

@Injectable({
  providedIn: 'root',
})
export class ChatStorage extends Dexie implements ChatStorageInterface {
  chats: Dexie.Table<ChatInterface, string>;

  constructor() {
    super('ChatStorage');
    this.version(1).stores({
      chats: 'id',
    });

    this.chats = this.table('chats');
  }

  getTotalChatsCount(): Promise<number> {
    return this.chats.count();
  }

  chatAtIndex(index: number): Promise<ChatInterface | undefined> {
    return this.chats.offset(index).first();
  }

  async createNewChat(chatData: ChatInterface): Promise<void> {
    await this.chats.add(chatData);
  }

  async clear(): Promise<void> {
    await this.chats.clear();
  }
}
