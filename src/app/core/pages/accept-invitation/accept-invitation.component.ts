import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../../http/http.service';


@Component({
  selector: 'app-accept-invitation',
  templateUrl: './accept-invitation.component.html',
  styleUrls: ['../../../../styles/palette.scss', '../../../../styles/common.scss']
})
export class AcceptInvitationComponent implements OnInit {
  constructor(private route: ActivatedRoute, private httpService: HttpService) {
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
    const sub = this.httpService.post(`/invitation/${this.invitationId?.trim()}/open`, {}).subscribe(data => {
      sub.unsubscribe();
      console.log(data);
    });
  }

}
