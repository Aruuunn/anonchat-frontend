import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../../../../services/user/user.service';

import { InvitationModalService } from '../../../../services/invitation-modal/invitation-modal.service';

@Component({
  selector: 'app-share-invitation',
  templateUrl: './share-invitation.component.html',
  styleUrls: ['../../../../../../styles/palette.scss'],
})
export class ShareInvitationComponent {
  constructor(
    public invitationModalService: InvitationModalService
  ) {}

  @ViewChild('infoText') infoTextEl: ElementRef | undefined;

  copyLink(): void {
    void navigator.clipboard.writeText(
      this.invitationModalService.invitationLink
    );

    if (typeof this.infoTextEl !== 'undefined') {
      this.infoTextEl.nativeElement.innerText = 'Link Copied to Clipboard!';
    }
  }
}
