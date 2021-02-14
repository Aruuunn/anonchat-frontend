import {Component, Input} from '@angular/core';
import {ChatService} from '../../chat/chat.service';


@Component({
  selector: 'app-chat-space',
  templateUrl: './chat-space.component.html',
  styleUrls: ['../../../../styles/palette.scss', './chat-space.component.sass']
})
export class ChatSpaceComponent {
  constructor(public chatService: ChatService) {
  }

  @Input() currentChatId!: null | string;

  messageText = '';

  onMessageSend(): void {
    if (this.currentChatId === null || typeof this.currentChatId === 'undefined') {
      return;
    }
    console.log('submitting...', this.messageText);
    const chatId = this.currentChatId;
    const messageText = this.messageText;
    this.chatService.sendMessage(this.currentChatId, this.messageText).then(() => {
      console.log('message sent');
      this.messageText = '';
      this.chatService.newMessageSentByLocalUser(chatId, messageText);
    });
  }

}
