import { Inject, Injectable } from '@angular/core';
import {
  DeviceType,
  MessageType,
  SessionCipher,
} from '@privacyresearch/libsignal-protocol-typescript';
import {
  SignalService,
  convertAllBufferStringToArrayBuffer,
} from '@anonchat/signal/src/public-api';

import { ChatType } from './chat-type.enum';
import { Events } from '../websockets/events.enum';
import { ChatInterface } from './interfaces/chat.interface';
import { MessageInterface } from './interfaces/message.interface';
import { ChatStorageInterface } from './interfaces/chat-storage.interface';
import { WebsocketsService } from '../websockets/websockets.service';
import { MESSAGES_STORAGE_INJECTION_TOKEN } from './storages/messages-storage';
import { MessageType as MessageTypeEnum } from './interfaces/message-type.interface';
import { MessagesStorageInterface } from './interfaces/messages-storage.interface';

export const CHAT_STORAGE_INJECTION_TOKEN = Symbol(
  'CHAT_STORAGE_INJECTION_TOKEN'
);

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private signalService: SignalService,
    private websocketService: WebsocketsService,
    @Inject(CHAT_STORAGE_INJECTION_TOKEN)
    private chatStorage: ChatStorageInterface,
    @Inject(MESSAGES_STORAGE_INJECTION_TOKEN)
    private messagesStorage: MessagesStorageInterface
  ) {}

  private textEncoder: TextEncoder = new TextEncoder();
  private textDecoder: TextDecoder = new TextDecoder();

  private sessionCiphers: Record<string, SessionCipher> = {};

  async clearChats(): Promise<void> {
    await this.chatStorage.clear();
    await this.messagesStorage.clear();
  }

  saveChats(chats: ChatInterface[]): void {
    this.chats = [...chats];
    const chatsClone: ChatInterface[] = [];
    for (const chat of chats) {
      const chatClone = Object.assign({}, chat);
      const messages = [...chatClone.messages];
      for (let i = 0; i < messages.length; i++) {
        if (
          !messages[i].sent &&
          messages[i].type !== MessageTypeEnum.RECEIVED
        ) {
          messages.splice(i, 1);
          i--;
        }
      }
      chatClone.messages = messages;
      chatsClone.push(chatClone);
    }

    this.storage.setItem('chats', JSON.stringify(chatsClone));
  }

  newChat(
    chatId: string,
    recipientId: string,
    type: ChatType,
    bundle?: DeviceType<string>,
    name?: string,
    sessionEstablished: boolean = false
  ): ChatInterface {
    this.chats.unshift({
      id: chatId,
      bundle,
      messages: [],
      name,
      recipientId,
      type,
      sessionEstablished,
    });
    this.saveChats(this.chats);
    return this.chats[0];
  }

  getRecentMessage(chatId: string): MessageInterface | null {
    const messages = this.getMessages(chatId);
    return messages.length === 0 ? null : messages[messages.length - 1];
  }

  getMessages(chatId: string | null): MessageInterface[] {
    if (chatId === null) {
      return [];
    }
    // tslint:disable-next-line:no-shadowed-variable
    const chat = this.chats.find((chat) => chat.id === chatId);
    const messages = chat?.messages ?? [];
    for (const message of messages) {
      message.read = true;
    }
    if (chat) {
      this.updateChat({ ...chat, messages });
    }

    return messages;
  }

  getNumberOfUnreadMessages(chat: ChatInterface): number {
    let totalUnReadMessages = 0;

    if (chat?.messages) {
      for (let i = chat.messages.length - 1; i >= 0; i--) {
        if (chat.messages[i].read) {
          break;
        }
        totalUnReadMessages += 1;
      }
    }

    return totalUnReadMessages;
  }

  updateChat(chatData: ChatInterface, bringToFirst: boolean = false): void {
    for (let i = 0; i < this.chats.length; i++) {
      const chat = this.chats[i];
      if (chat.id === chatData.id) {
        this.chats[i] = Object.assign(chat, chatData);
        if (bringToFirst && this.chats.length > 1) {
          const temp = this.chats[i];
          this.chats[i] = this.chats[0];
          this.chats[0] = temp;
        }
        break;
      }
    }
    this.saveChats(this.chats);
  }

  getChatName(chatId: string | null): string | null {
    if (chatId === null) {
      return null;
    }
    const chat = this.chats.find((ch) => ch.id === chatId);
    if (!chat) {
      return null;
    }
    return chat.name ?? 'Unknown';
  }

  newMessageSentByLocalUser(
    chatId: string,
    messageText: string
  ): string | null {
    const chat = this.chats.find((ch) => ch.id === chatId);
    if (chat) {
      const messageId = `${Date.now()}${Math.ceil(Math.random() * 10000)}`; // temporary Id
      const message = {
        messageText,
        type: MessageTypeEnum.SENT,
        read: true,
        sent: false,
        id: messageId,
      };
      chat.messages.push(message);
      this.updateChat(chat, true);
      return messageId;
    }
    return null;
  }

  async messageSuccessfullySentByLocalUser(
    chatId: string,
    temporaryMessageId: string,
    messageId: string
  ): Promise<void> {
    const chat = await this.getChat(chatId);
    if (chat) {
      const message = chat.messages.find((m) => m.id === temporaryMessageId);
      if (message) {
        message.sent = true;
        message.id = messageId;
      }
    }
  }

  async getChat(chatId: string): Promise<ChatInterface> {
    return (
      this.chats.find((chat) => chat.id === chatId) ??
      (await new Promise((res, _) => {
        this.websocketService.emit(
          Events.FETCH_RECIPIENT_ID,
          { chatId },
          ({ recipientId }: { recipientId: string }) => {
            const chat = this.newChat(
              chatId,
              recipientId,
              ChatType.KNOWN,
              undefined,
              this.getRandomName(),
              true
            );
            res(chat);
          }
        );
      }))
    );
  }

  private async getSessionCipher(chat: ChatInterface): Promise<SessionCipher> {
    if (!chat.sessionEstablished && chat.type === ChatType.ANONYMOUS) {
      console.log('establishing session..');
      await this.signalService.establishSession(
        convertAllBufferStringToArrayBuffer(chat.bundle) as DeviceType,
        chat.recipientId,
        1
      );
      chat.sessionEstablished = true;
    }
    const sessionCipher =
      this.sessionCiphers[chat.id] ??
      (await this.signalService.getSessionCipher(chat.recipientId, 1));
    if (!this.sessionCiphers[chat.id]) {
      this.sessionCiphers[chat.id] = sessionCipher;
    }

    return sessionCipher;
  }

  async encryptMessage(payload: {
    chatId: string;
    plaintext: string;
  }): Promise<MessageType> {
    const { chatId, plaintext } = payload;
    const chat = await this.getChat(chatId);
    const sessionCipher = await this.getSessionCipher(chat);
    const message = await sessionCipher.encrypt(
      this.textEncoder.encode(plaintext).buffer
    );

    return { ...message, body: btoa(message.body ?? '') };
  }

  async decryptMessage(payload: {
    chatId: string;
    message: MessageType;
  }): Promise<string> {
    const { chatId, message } = payload;
    const chat = await this.getChat(chatId);
    const sessionCipher = await this.getSessionCipher(chat);
    const buffer = await this.signalService.decryptMessage(
      { ...message, body: atob(message.body ?? '') },
      sessionCipher
    );
    return this.textDecoder.decode(buffer);
  }

  async sendMessage(chatId: string, plaintext: string): Promise<string> {
    const message: MessageType = await this.encryptMessage({
      chatId,
      plaintext,
    });

    console.log('message sent ' + JSON.stringify(message));
    return new Promise<string>((res, _) => {
      this.websocketService.emit(
        Events.SEND_MESSAGE,
        { chatId, message },
        (messageId) => {
          console.log('Message Sent.... ' + messageId);
          res(messageId);
        }
      );
    });
  }

  async newReceivedMessage(payload: {
    chatId: string;
    message: MessageType & { messageId: string };
  }): Promise<void> {
    const {
      chatId,
      message: { messageId },
    } = payload;
    const plaintext = await this.decryptMessage(payload);
    const chat = await this.getChat(chatId);
    chat.messages.push({
      type: MessageTypeEnum.RECEIVED,
      messageText: plaintext,
      read: false,
      id: messageId,
    });
    this.updateChat(chat, true);
  }

  fetchAllChats(type?: string): ChatInterface[] {
    return this.chats.filter(
      (chat) => typeof type === 'undefined' || chat.type === type
    );
  }

  hasUnreadMessage(type?: string): boolean {
    const chats = this.fetchAllChats(type);
    for (const chat of chats) {
      if (
        chat.messages.length > 0 &&
        !chat.messages[chat.messages.length - 1].read
      ) {
        return true;
      }
    }
    return false;
  }
}
