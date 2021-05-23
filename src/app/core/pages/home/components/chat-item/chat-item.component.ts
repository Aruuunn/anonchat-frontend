import { Component, Inject, Input, OnInit } from '@angular/core';
import { ChatStorageInterface } from '../../../../services/chat/interfaces/chat-storage.interface';
import { CHAT_STORAGE_INJECTION_TOKEN } from '../../../../services/chat/storages/chat-storage';
import { ChatInterface } from '../../../../services/chat/interfaces/chat.interface';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-chat-item',
  templateUrl: './chat-item.component.html',
  styleUrls: ['../../../../../../styles/palette.scss'],
})
export class ChatItemComponent implements OnInit {
  constructor(
    @Inject(CHAT_STORAGE_INJECTION_TOKEN)
    private chatStorage: ChatStorageInterface
  ) {}

  @Input() index?: number;
  @Input() currentChatId!: BehaviorSubject<string | null>;

  chat: ChatInterface | null = null;

  ngOnInit(): void {
    if (typeof this.index === 'number') {
      this.chatStorage.chatAtIndex(this.index).then((fetchedChat) => {
        if (fetchedChat) {
          this.chat = fetchedChat;
        }
      });
    }
  }
}
