import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ChatService} from '../../chat/chat.service';

@Component({
  selector: 'app-all-chats',
  templateUrl: './all-chats.component.html',
  styleUrls: ['../../../../styles/palette.scss']
})
export class AllChatsComponent {
  constructor(public chatService: ChatService) {
  }

  @Input() currentChatId!: string | null ;
  @Output() changeCurrentChat: EventEmitter<string> = new EventEmitter<string>();


}
