import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {UserService} from '../../user/user.service';
import urlJoin from 'url-join';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-share-invitation',
  templateUrl: './share-invitation.component.html',
  styleUrls: ['../../../../styles/palette.scss']
})
export class ShareInvitationComponent {
  constructor(private userService: UserService) {
  }

  @Input('isInvitationShareModalOpen') isInvitationShareModalOpen: undefined | BehaviorSubject<boolean>;

  @ViewChild('infoText') infoTextEl: ElementRef | undefined;

  get invitationLink(): string {
    return urlJoin(window.location.href, `/invitation/${this.userService.user?.invitationId}`);
  }

  copyLink(): void {
    void navigator.clipboard.writeText(this.invitationLink);
    if (typeof this.infoTextEl !== 'undefined') {
      this.infoTextEl.nativeElement.innerText = 'Link Copied to Clipboard!';
    }
  }
}
