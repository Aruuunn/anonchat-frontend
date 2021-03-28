import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
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
export class ChatSpaceComponent implements AfterViewChecked {
  constructor(public chatService: ChatService) {}

  @Input() currentChatId!: BehaviorSubject<null | string>;
  @ViewChild('chat_messages')
  chatMessagesContainerRef!: ElementRef<HTMLDivElement>;

  messageText = '';

  ngAfterViewChecked(): void {
    this.scrollToBottom();

    this.currentChatId.subscribe(() => {
      this.scrollToBottom();
    });
  }

  private scrollToBottom(): void {
    const el = this.chatMessagesContainerRef.nativeElement;

    el.scroll({
      top: el.scrollHeight,
    });
  }

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
        this.scrollToBottom();

        if (temporaryMessageId) {
          void this.chatService.messageSuccessfullySentByLocalUser(
            chatId,
            temporaryMessageId,
            messageId
          );
        }
      })
      .catch((e) => console.log('ERROR ', e));
  }
}
