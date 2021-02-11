import {Component} from '@angular/core';
import {BehaviorSubject} from 'rxjs';


@Component({
  selector: 'app-home-shell',
  templateUrl: './home-shell.component.html',
  styleUrls: ['../../../../styles/palette.scss']
})
export class HomeShellComponent {

  isInvitationShareModalOpen = new BehaviorSubject<boolean>(false);

}
