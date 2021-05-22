import Dexie from 'dexie';
import { MessagesStorageInterface } from '../interfaces/messages-storage.interface';
import { MessageInterface } from '../interfaces/message.interface';
import { Injectable } from '@angular/core';

export const MESSAGES_STORAGE_INJECTION_TOKEN = Symbol(
  'MESSAGES_STORAGE_INJECTION_TOKEN'
);

@Injectable({
  providedIn: 'root',
})
export class MessagesStorage extends Dexie implements MessagesStorageInterface {
  private readonly messages: Dexie.Table<MessageInterface, string>;

  constructor() {
    super('Message Storage');
    this.version(1).stores({
      chats: 'id',
    });

    this.messages = this.table('messages');
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
    await this.messages.add(message);
  }

  async clear(): Promise<void> {
    await this.messages.clear();
  }
}
