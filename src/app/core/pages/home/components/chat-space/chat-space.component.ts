import { Component, Input } from '@angular/core';
import { ChatService } from '../../../../services/chat/chat.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-chat-space',
  templateUrl: './chat-space.component.html',
  styleUrls: [
    '../../../../../../styles/palette.scss',
    './chat-space.component.sass',
  ],
})
export class ChatSpaceComponent {
  constructor(public chatService: ChatService) {}

  @Input() currentChatId!: BehaviorSubject<null | string>;

  messageText = '';

  onMessageSend(): void {
    const chatId = this.currentChatId.getValue();
    const messageText = this.messageText;
    if (
      chatId === null ||
      typeof chatId === 'undefined' ||
      messageText.trim().length === 0
    ) {
      return;
    }
    const temporaryMessageId = this.chatService.newMessageSentByLocalUser(
      chatId,
      messageText
    );
    this.messageText = '';

    this.chatService
      .sendMessage(chatId, messageText)
      .then((messageId) => {
        if (temporaryMessageId) {
          this.chatService.messageSuccessfullySentByLocalUser(
            chatId,
            temporaryMessageId,
            messageId
          );
        }
      })
      .catch((e) => console.log('ERROR ', e));
  }
}