import {Component} from '@angular/core';
import {SignalService} from '../../../../../projects/signal/src/lib/signal.service';
import {NgForm} from '@angular/forms';
import {HttpService} from '../../http/http.service';
import {UserService} from '../../user/user.service';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['../../../../styles/common.scss', './welcome.component.scss']
})
export class WelcomeComponent {
  constructor(private signalService: SignalService, private httpService: HttpService, private userService: UserService) {
  }

  loading = false;
  error: null | string = null;


  submitHandler(form: NgForm): void {
    const fullName = form.controls.fullName.value?.trim();
    console.assert(typeof fullName !== 'undefined' && fullName !== null, 'FullName has to be defined');
    this.signalService.register().then(bundle => {
      this.loading = true;
      this.httpService.post('/auth/register', {
        bundle,
        fullName
      }).subscribe((payload: { invitationId: string, id: string }) => {
        const {id, invitationId} = payload;
        this.loading = false;
        this.userService.setUser({id, fullName, invitationId});
      }, ({error}) => {
        this.loading = false;
        this.error = error.message;
      });
    });
  }
}
