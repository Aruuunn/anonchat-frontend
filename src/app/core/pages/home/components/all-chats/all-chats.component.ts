import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatService } from '../../../../services/chat/chat.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { WebsocketsService } from '../../../../services/websockets/websockets.service';

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
    private router: Router,
    private websocketService: WebsocketsService
  ) {}

  @Input() currentChatId!: BehaviorSubject<null | string>;
  @Input() onLogout!: () => void;
  @Input() chatType!: string;
}
