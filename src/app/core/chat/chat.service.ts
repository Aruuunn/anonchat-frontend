import {Injectable} from '@angular/core';
import {DeviceType, SessionCipher, MessageType} from '@privacyresearch/libsignal-protocol-typescript';
import {ChatInterface} from './chat.interface';
import {MessageInterface, MessageType as MessageTypeEnum} from './message.interface';
import {SignalService} from '../../../../projects/signal/src/lib/signal.service';
import {WebsocketsService} from '../websockets/websockets.service';
import {Events} from '../websockets/events.enum';
import {convertAllBufferStringToArrayBuffer} from '../../../../projects/signal/src/lib/utils/array-buffer.utils';


// @TODO provide storage backend through DI
// @TODO refactor this ugly code
// @TODO modify code to make speed optimal
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private signalService: SignalService, private websocketService: WebsocketsService) {
  }

  private textEncoder: TextEncoder = new TextEncoder();
  private textDecoder: TextDecoder = new TextDecoder();

  private sessionCiphers: Record<string, SessionCipher> = {};

  chats: ChatInterface[] = JSON.parse(localStorage.getItem('chats') as string) ?? [];

  clearChats(): void {
    this.chats = [];
    localStorage.clear();
    sessionStorage.clear();
  }

  saveChats(chats: ChatInterface[]): void {
    this.chats = [...chats];
    localStorage.setItem('chats', JSON.stringify(chats));
  }

  newChat(chatId: string, recipientId: string, bundle?: DeviceType<string>, name?: string): void {
    this.chats.unshift({id: chatId, bundle, messages: [], name, recipientId});
    this.saveChats(this.chats);
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
      this.updateChat({...chat, messages});
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
    // tslint:disable-next-line:no-shadowed-variable
    const chat = this.chats.find((chat) => chat.id === chatId);
    if (!chat) {
      return null;
    }
    return chat.name ?? 'Anonymous';
  }

  newMessageSentByLocalUser(chatId: string, message: string): void {
    // tslint:disable-next-line:no-shadowed-variable
    const chat = this.chats.find((chat) => chat.id === chatId);
    if (chat) {
      chat.messages.push({message, type: MessageTypeEnum.SENT, read: true});
      this.updateChat(chat, true);
    }
  }

  async getChat(chatId: string): Promise<ChatInterface> {
    return this.chats.find((chat) => chat.id === chatId) ?? await new Promise((res, rej) => {
      // tslint:disable-next-line:no-shadowed-variable
      this.websocketService.emit(Events.FETCH_RECIPIENT_ID, {chatId}, ({recipientId}: { recipientId: string }) => {
        this.newChat(chatId, recipientId);
        res(this.chats[0]);
      });
    });
  }

  private async getSessionCipher(chat: ChatInterface): Promise<SessionCipher> {
    // tslint:disable-next-line:no-non-null-assertion
    console.log('bundle ', convertAllBufferStringToArrayBuffer(chat.bundle!));
    if (chat.messages.length === 0 && chat.bundle) {
      await this.signalService.establishSession(
        convertAllBufferStringToArrayBuffer(chat.bundle) as DeviceType,
        chat.recipientId,
        1
      );
    }
    console.log('recipientId', chat.recipientId);
    const sessionCipher = this.sessionCiphers[chat.id] ?? await this.signalService.getSessionCipher(chat.recipientId, 1);
    if (!this.sessionCiphers[chat.id]) {
      this.sessionCiphers[chat.id] = sessionCipher;
    }

    return sessionCipher;
  }

  async encryptMessage(payload: { chatId: string, plaintext: string }): Promise<MessageType> {
    const {chatId, plaintext} = payload;
    const chat = await this.getChat(chatId);
    const sessionCipher = await this.getSessionCipher(chat);
    return await sessionCipher.encrypt(this.textEncoder.encode(plaintext).buffer);
  }

  async decryptMessage(payload: { chatId: string, message: MessageType }): Promise<string> {
    const {chatId, message} = payload;
    const chat = await this.getChat(chatId);
    const sessionCipher = await this.getSessionCipher(chat);
    const buffer = await this.signalService.decryptMessage(message, sessionCipher);
    return this.textDecoder.decode(buffer);
  }

  async sendMessage(chatId: string, plaintext: string): Promise<void> {
    const message: MessageType = await this.encryptMessage({chatId, plaintext});
    this.websocketService.emit(Events.SEND_MESSAGE, {chatId, message}, (messageId) => {
      console.log('Message Sent.... ' + messageId);
    });
  }


  async newReceivedMessage(payload: { chatId: string, message: MessageType }): Promise<void> {
    const {chatId} = payload;
    const plaintext = await this.decryptMessage(payload);
    const chat = await this.getChat(chatId);
    chat.messages.push({type: MessageTypeEnum.RECEIVED, message: plaintext, read: false});
    this.updateChat(chat, true);
  }

  saveNotReadMessages(messages: { chatId: string, ciphertext: string; }[]): void {
    for (const message of messages) {
      // tslint:disable-next-line:no-shadowed-variable
      const chat = this.chats.find((chat) => chat.id === message.chatId);
      if (!chat) {
        console.error(`Chat with chat Id - ${message.chatId} not found`);
        continue;
      }

      chat.messages.push({message: message.ciphertext, type: MessageTypeEnum.RECEIVED, read: false});
      this.updateChat(chat, true);
    }
  }

  fetchAllChats(): ChatInterface[] {
    return this.chats;
  }
}
