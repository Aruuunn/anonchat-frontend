import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-accept-invitation',
  templateUrl: './accept-invitation.component.html'
})
export class AcceptInvitationComponent implements OnInit {
  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      console.log(param.get('id'));
    });
  }

}
