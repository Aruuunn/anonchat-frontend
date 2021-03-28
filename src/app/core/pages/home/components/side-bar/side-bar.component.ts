import { Component, Input } from '@angular/core';
import { ChatService } from '../../../../services/chat/chat.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { TutorialService } from '../../../../services/tutorial/tutorial.service';
import { InvitationModalService } from '../../../../services/invitation-modal/invitation-modal.service';
import {WebsocketsService} from "../../../../services/websockets/websockets.service";

@Component({
  templateUrl: './side-bar.component.html',
  selector: 'app-side-bar',
  styleUrls: [
    '../../../../../../styles/palette.scss',
    './side-bar.component.scss',
  ],
})
export class SideBarComponent {
  constructor(
    public chatService: ChatService,
    private router: Router,
    private websocketService: WebsocketsService,
    public tutorialService: TutorialService,
    public invitationModalService: InvitationModalService
  ) {}

  @Input() onLogout!: () => void;
  @Input() currentChatId!: BehaviorSubject<null | string>;
  @Input() currentChatType!: BehaviorSubject<string>;
}
