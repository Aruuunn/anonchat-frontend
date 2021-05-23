import {
  AfterContentInit,
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ChatService } from '../../../../services/chat/chat.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ChatStorage } from '../../../../services/chat/storages/chat-storage';
import { generateArrayOfSize } from '../../../../../shared/utils/generate-array-of-size';

@Component({
  selector: 'app-chat-space',
  templateUrl: './chat-space.component.html',
  styleUrls: [
    '../../../../../../styles/palette.scss',
    './chat-space.component.sass',
  ],
})
export class ChatSpaceComponent
  implements AfterViewChecked, AfterContentInit, OnDestroy {
  constructor(
    public chatService: ChatService,
    private chatStorage: ChatStorage
  ) {}

  @Input() currentChatId!: BehaviorSubject<null | string>;
  @ViewChild('chat_messages')
  chatMessagesContainerRef!: ElementRef<HTMLDivElement>;

  totalMessages = new BehaviorSubject<number>(0);
  subscriptions: Subscription[] = [];

  messageText = '';
  genArray = generateArrayOfSize;

  ngAfterContentInit(): void {
    const sub = this.currentChatId.subscribe((chatId) => {
      if (chatId) {
        this.chatStorage.getTotalMessageCount(chatId).then((count) => {
          this.totalMessages.next(count);
        });
      }
    });
    this.subscriptions.push(sub);
  }

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

  async onMessageSend(): Promise<void> {
    const chatId = this.currentChatId.getValue();
    const messageText = this.messageText;
    if (
      chatId === null ||
      typeof chatId === 'undefined' ||
      messageText.trim().length === 0
    ) {
      return;
    }
    const temporaryMessageId = await this.chatService.newMessageSentByLocalUser(
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

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}
