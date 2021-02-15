import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../../http/http.service';
import {ChatService} from '../../chat/chat.service';


// @TODO make sure the same person cannot accept the invitation more than once in frontend and backend
@Component({
  selector: 'app-accept-invitation',
  templateUrl: './accept-invitation.component.html',
  styleUrls: ['../../../../styles/palette.scss', '../../../../styles/common.scss']
})
export class AcceptInvitationComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private httpService: HttpService,
    private router: Router,
    private chatService: ChatService
  ) {
  }

  fullName = '';
  invitationId = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      this.invitationId = param.get('invitationId') ?? '';
    });
    this.route.data.subscribe(data => {
      this.fullName = data?.invitationDetails?.fullName ?? '';
    });
  }

  acceptInvitation(): void {
    this.httpService.post(`/invitation/${this.invitationId?.trim()}/open`, {}).subscribe(data => {
      const {chatId, bundle, recipientId} = data;

      console.assert(typeof chatId !== 'undefined', 'ChatId has to be defined');
      console.assert(typeof recipientId !== 'undefined', 'recipientId has to be defined');
      console.assert(typeof bundle !== 'undefined', 'Bundle has to be defined');

      this.chatService.newChat(chatId, recipientId, bundle, this.fullName);
      void this.router.navigateByUrl('/');
    }, (error) => {
      console.error(error);
    });
  }
}
