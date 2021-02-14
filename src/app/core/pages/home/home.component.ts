import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';
import {WebsocketsService} from '../../websockets/websockets.service';
import {WEBSOCKET_URI} from '../../../../config/api.config';
import {Events} from '../../websockets/events.enum';
import {ChatService} from '../../chat/chat.service';
import {arrayBufferToString} from '@privacyresearch/libsignal-protocol-typescript/lib/helpers';
import {MessageType} from '@privacyresearch/libsignal-protocol-typescript';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../../../styles/palette.scss']
})
export class HomeComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private websocketService: WebsocketsService,
    private chatService: ChatService,
  ) {
  }

  currentChatId: null | string  = null;
  isInvitationShareModalOpen = new BehaviorSubject<boolean>(false);

  async sendMessage(message: string): Promise<void> {
    if (this.currentChatId !== null && message && message.trim().length !== 0) {
      console.log('Sending Message');
      const textEncoder = new TextEncoder();
      const ciphertext = textEncoder.encode(message);
      this.websocketService.emit(Events.SEND_MESSAGE, {ciphertext, chatId: this.currentChatId}, (payload) => {
        console.log(`Sent the Message ${payload}`);
      });
    }
  }

  ngOnInit(): void {
    this.websocketService.connectToWs(WEBSOCKET_URI);
    this.websocketService.addEventListener(Events.CONNECT, () => {
      this.websocketService.emit(Events.FETCH_NOT_DELIVERED_MESSAGES, {}, (data) => {
        console.log('Fetched all not delivered messages ....', data);
        this.websocketService.emit(Events.RECEIVED_ALL_NOT_DELIVERED_MESSAGES, {}, () => {
          console.log('sent ack that all not delivered messages are delivered....', data);
          this.websocketService.emit(Events.CREATE_SELF_ROOM, {}, () => {
            console.log('Created Self room...');
            this.websocketService.addEventListener(
              Events.SEND_MESSAGE, (payload: { chatId: string, message: MessageType, messageId: string }) => {
                const {message, chatId, messageId} = payload;
                console.log('Received a Message ' + messageId);
                this.chatService.newReceivedMessage({chatId, message}).then(() => {
                  this.websocketService.emit(Events.RECEIVED_MESSAGE, {messageId, chatId});
                });
              });
          });
        });
      });
    });
  }
}
