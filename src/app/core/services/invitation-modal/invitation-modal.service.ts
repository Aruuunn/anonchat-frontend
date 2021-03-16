import { Injectable } from '@angular/core';
import urlJoin from 'url-join';
import { UserService } from '../user/user.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvitationModalService {
  constructor(private userService: UserService) {}

  isInvitationShareModalOpen = new BehaviorSubject<boolean>(false);

  get invitationLink(): string {
    return urlJoin(
      window.location.href,
      `/accept-invitation/${this.userService.user?.invitationId}`
    );
  }

  openInvitationShareModal(): void {
    if ('share' in navigator) {
      navigator
        .share({
          title:
            'AnonChat - Invitation Link of ' + this.userService.user?.fullName,
          url: this.invitationLink,
        })
        .then(() => {
          this.isInvitationShareModalOpen?.next(false);
        });
    } else {
      this.isInvitationShareModalOpen?.next(true);
    }
  }

  closeInvitationShareModal(): void {
    this.isInvitationShareModalOpen?.next(false);
  }
}
