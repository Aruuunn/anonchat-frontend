import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ChatService} from '../../chat/chat.service';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-all-chats',
  templateUrl: './all-chats.component.html',
  styleUrls: ['../../../../styles/palette.scss']
})
export class AllChatsComponent {
  constructor(public chatService: ChatService) {
  }

  @Input() currentChatId!: BehaviorSubject<null | string>;
}
