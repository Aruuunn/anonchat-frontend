import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';
import {WebsocketsService} from '../../websockets/websockets.service';
import {WEBSOCKET_URI} from '../../../../config/api.config';
import {Events} from '../../websockets/events.enum';
import {ChatService} from '../../chat/chat.service';
import {MessageType} from '@privacyresearch/libsignal-protocol-typescript';
import {ChatType} from '../../chat/chat-type.enum';


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
    public chatService: ChatService,
  ) {
  }

  currentChatId = new BehaviorSubject<null | string>(null);
  isInvitationShareModalOpen = new BehaviorSubject<boolean>(false);
  currentChatType = new BehaviorSubject<string>(ChatType.ANONYMOUS);

  onLogout(): void {
    localStorage.clear();
    sessionStorage.clear();
    void this.router.navigateByUrl('/welcome');
  }


  ngOnInit(): void {
    this.websocketService.connectToWs(WEBSOCKET_URI);
    this.websocketService.addEventListener(Events.CONNECT, () => {
        console.log('Connected to Ws Server');

        console.log('trying to fetch not delivered messages...');
        this.websocketService.emit(Events.FETCH_NOT_DELIVERED_MESSAGES, {}, (data) => {

          console.log('Fetched all not delivered messages ....', data);
          this.websocketService.emit(Events.RECEIVED_ALL_NOT_DELIVERED_MESSAGES, {}, () => {
            console.log('sent ack that all not delivered messages are delivered....', data);
            const promisesOfReceivedMessages: Promise<any>[] = [];
            if (data instanceof Array) {
              for (const message of data) {
                promisesOfReceivedMessages.push(this.chatService.newReceivedMessage(message));
              }
            }
            Promise.all(promisesOfReceivedMessages).then(() => {
              this.websocketService.emit(Events.CREATE_SELF_ROOM, {}, () => {
                console.log('Created Self room...');
                this.websocketService.removeEventListener(Events.SEND_MESSAGE);
                this.websocketService.addEventListener(
                  Events.SEND_MESSAGE, (payload: { chatId: string, message: MessageType & { messageId: string }, messageId: string }) => {
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
    );
  }
}
