import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatService } from '../../../../services/chat/chat.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { WebsocketsService } from '../../../../services/websockets/websockets.service';
import { ChatInterface } from '../../../../services/chat/interfaces/chat.interface';
import { ChatStorage } from '../../../../services/chat/storages/chat-storage';

@Component({
  selector: 'app-all-chats',
  templateUrl: './all-chats.component.html',
  styleUrls: [
    '../../../../../../styles/palette.scss',
    './all-chats.component.scss',
  ],
})
export class AllChatsComponent {
  constructor(
    public chatService: ChatService,
    private chatStorage: ChatStorage,
    private router: Router,
    private websocketService: WebsocketsService
  ) {
    this.chatService.totalChatsCount.subscribe((count) => {
      this.items = Array.from({ length: count });
    });
  }

  items = [];
  @Input() currentChatId!: BehaviorSubject<null | string>;
  @Input() onLogout!: () => void;
  @Input() chatType!: string;

  getChat(index: number): BehaviorSubject<ChatInterface | undefined> {
    const chat = new BehaviorSubject<ChatInterface | undefined>(undefined);
    this.chatStorage.chatAtIndex(index).then(chat.next);
    return chat;
  }
}
