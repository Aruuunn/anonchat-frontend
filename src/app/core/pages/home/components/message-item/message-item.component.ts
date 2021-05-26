import { AfterContentInit, Component, Input, OnInit } from '@angular/core';
import { MessageInterface } from '../../../../services/chat/interfaces/message.interface';
import { ChatStorage } from '../../../../services/chat/storages/chat-storage';
import { ChatService } from '../../../../services/chat/chat.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['../../../../../../styles/palette.scss'],
})
export class MessageItemComponent implements OnInit {
  constructor(
    private chatStorage: ChatStorage,
    private chatService: ChatService
  ) {}

  @Input() index?: number;
  @Input() chatId?: string;

  message: MessageInterface | undefined;

  fetchChat(): void {
    if (typeof this.index === 'number' && typeof this.chatId === 'string') {
      this.chatStorage
        .messageAtIndex(this.chatId, this.index)
        .then((fetchedMessage) => {
          this.message = fetchedMessage;
        });
      //  .pipe(filter(message => Boolean(message && message.chatId === this.currentChatId.getValue())))
    }
  }

  ngOnInit(): void {
    this.fetchChat();
    this.chatService.onNewMessage.subscribe(() => {
      this.fetchChat();
    });
    //  .pipe(filter(message => Boolean(message && message.chatId === this.currentChatId.getValue())))
  }
}
