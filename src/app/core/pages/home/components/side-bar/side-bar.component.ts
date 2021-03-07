import { Component, Input } from '@angular/core';
import { ChatService } from '../../../../services/chat/chat.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  templateUrl: './side-bar.component.html',
  selector: 'app-side-bar',
  styleUrls: [
    '../../../../../../styles/palette.scss',
    './side-bar.component.scss',
  ],
})
export class SideBarComponent {
  constructor(public chatService: ChatService, private router: Router) {}

  @Input() isInvitationShareModalOpen!: BehaviorSubject<boolean>;
  @Input() onLogout!: () => void;
  @Input() currentChatId!: BehaviorSubject<null | string>;
  @Input() currentChatType!: BehaviorSubject<string>;
}
