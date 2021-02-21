import {Component} from '@angular/core';
import {SignalService} from '../../../../../projects/signal/src/lib/signal.service';
import {NgForm} from '@angular/forms';
import {HttpService} from '../../http/http.service';
import {UserService} from '../../user/user.service';
import {Router} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {ActivatedRoute} from '@angular/router';
import {convertAllArrayBufferToString} from '../../../../../projects/signal/src/lib/utils/array-buffer.utils';
import {ChatService} from '../../chat/chat.service';
import {LoadingStateService} from '../../services/loading-state.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['../../../../styles/common.scss', './welcome.component.scss']
})
export class WelcomeComponent {
  constructor(
    private signalService: SignalService,
    private httpService: HttpService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService,
    public loadingStateService: LoadingStateService
  ) {
  }

  error: null | string = null;

  async submitHandler(form: NgForm): Promise<void> {

    this.loadingStateService.isLoading = true;

    setTimeout(async () => {
      this.chatService.clearChats();
      const fullName = form.controls.fullName.value?.trim();
      console.assert(typeof fullName !== 'undefined' && fullName !== null, 'FullName has to be defined');
      const bundle = await this.signalService.register();

      this.httpService.post('/auth/register', {
        bundle: convertAllArrayBufferToString(bundle),
        fullName
      }).subscribe((payload: { invitationId: string, id: string, accessToken: string }) => {
          const {id, invitationId, accessToken} = payload;
          this.loadingStateService.isLoading = false;

          this.userService.setUser({id, fullName, invitationId});
          this.authService.isLoggedIn = true;
          this.authService.accessToken = accessToken;
          const nextURL = this.activatedRoute.snapshot.queryParamMap.get('next');
          this.router.navigateByUrl(nextURL ?? '/');
        },
        ({error}) => {
          this.loadingStateService.isLoading = false;
          this.error = error.message?.trim() || 'Something went wrong. Try again later';
        });
    }, 0);
  }
}
