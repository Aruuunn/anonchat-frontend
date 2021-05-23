import { Component, Input, OnInit } from '@angular/core';
import { MessageInterface } from '../../../../services/chat/interfaces/message.interface';
import { ChatStorage } from '../../../../services/chat/storages/chat-storage';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['../../../../../../styles/palette.scss'],
})
export class MessageItemComponent implements OnInit {
  constructor(private chatStorage: ChatStorage) {}

  @Input() index?: number;
  @Input() chatId?: string;

  message: MessageInterface | undefined;

  ngOnInit(): void {
    if (typeof this.index === 'number' && typeof this.chatId === 'string') {
      this.chatStorage
        .messageAtIndex(this.chatId, this.index)
        .then((fetchedMessage) => {
          this.message = fetchedMessage;
        });
    }
  }
}
