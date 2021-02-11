import {Component} from '@angular/core';
import {BehaviorSubject} from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../../../styles/palette.scss']
})
export class HomeComponent {

  isInvitationShareModalOpen = new BehaviorSubject<boolean>(false);

}
