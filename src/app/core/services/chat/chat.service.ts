import { Inject, Injectable } from '@angular/core';
import {
  DeviceType,
  MessageType,
  SessionCipher,
} from '@privacyresearch/libsignal-protocol-typescript';
import { BehaviorSubject } from 'rxjs';
import {
  convertAllBufferStringToArrayBuffer,
  SignalService,
} from '@anonchat/signal/src/public-api';

import { ChatType } from './chat-type.enum';
import { Events } from '../websockets/events.enum';
import { ChatInterface } from './interfaces/chat.interface';
import { MessageInterface } from './interfaces/message.interface';
import { ChatStorageInterface } from './interfaces/chat-storage.interface';
import { WebsocketsService } from '../websockets/websockets.service';
import { MessageType as MessageTypeEnum } from './interfaces/message-type.interface';
import { CHAT_STORAGE_INJECTION_TOKEN } from './storages/chat-storage';
import { getRandomName } from '../../../shared/utils';

type NewChatData = Partial<
  Pick<ChatInterface, 'bundle' | 'name' | 'sessionEstablished'>
> &
  Pick<ChatInterface, 'id' | 'recipientId' | 'type'>;

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private signalService: SignalService,
    private websocketService: WebsocketsService,
    @Inject(CHAT_STORAGE_INJECTION_TOKEN)
    private chatStorage: ChatStorageInterface
  ) {
    chatStorage.getTotalChatsCount().then((count) => {
      this.totalChatsCount.next(count);
    });
  }

  totalChatsCount = new BehaviorSubject(0);

  private textEncoder: TextEncoder = new TextEncoder();
  private textDecoder: TextDecoder = new TextDecoder();
  private sessionCiphers: Record<string, SessionCipher> = {};

  async clearChats(): Promise<void> {
    await this.chatStorage.clear();
  }

  async newChat(newChatData: NewChatData): Promise<ChatInterface> {
    const chat: ChatInterface = {
      ...newChatData,
      messages: [],
      sessionEstablished: newChatData.sessionEstablished ?? false,
      lastUpdatedAt: new Date(),
    };
    await this.chatStorage.createNewChat(chat);

    return chat;
  }

  getRecentMessage(chatId: string): Promise<MessageInterface | undefined> {
    return this.chatStorage.getLastMessage(chatId);
  }

  getNumberOfUnreadMessages(chatId: string): Promise<number> {
    return this.chatStorage.getNumberOfUnreadMessages(chatId);
  }

  async bringChatToTop(chatId: string): Promise<void> {
    const chat = await this.chatStorage.getChatUsingId(chatId);

    if (chat) {
      await this.chatStorage.updateChat({ ...chat, lastUpdatedAt: new Date() });
    }
  }

  async getChatName(chatId: string | null): Promise<string | null> {
    if (chatId === null) {
      return null;
    }
    const chat = await this.chatStorage.getChatUsingId(chatId);
    if (!chat) {
      return null;
    }
    return chat.name ?? 'Unknown';
  }

  async newMessageSentByLocalUser(
    chatId: string,
    messageText: string
  ): Promise<string | null> {
    const chat = await this.chatStorage.getChatUsingId(chatId);
    if (chat) {
      const messageId = `${Date.now()}${Math.ceil(Math.random() * 10000)}`; // temporary Id
      const message: MessageInterface = {
        messageText,
        type: MessageTypeEnum.SENT,
        read: true,
        sent: false,
        id: messageId,
        chatId,
      };
      await this.chatStorage.addNewMessage(message);
      await this.bringChatToTop(chatId);
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
      (await this.chatStorage.getChatUsingId(chatId)) ??
      (await new Promise((res, _) => {
        this.websocketService.emit(
          Events.FETCH_RECIPIENT_ID,
          { chatId },
          async ({ recipientId }: { recipientId: string }) => {
            const chat = await this.newChat({
              id: chatId,
              recipientId,
              type: ChatType.KNOWN,
              name: getRandomName(),
              sessionEstablished: true,
            });
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
    await this.chatStorage.addNewMessage({
      chatId,
      type: MessageTypeEnum.RECEIVED,
      messageText: plaintext,
      read: false,
      id: messageId,
    });

    await this.bringChatToTop(chatId);
  }

  hasUnreadMessage(type?: string): boolean {
    /* TODO return correct value */
    return false;
  }
}
