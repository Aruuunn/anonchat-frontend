import {Component, EventEmitter, OnInit, Output,} from '@angular/core';
import {NgForm} from '@angular/forms';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {AuthService} from '../../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../../../styles/common.scss', '../../../../styles/palette.scss']
})
export class LoginComponent implements OnInit {
  @Output() afterLogin: EventEmitter<any> = new EventEmitter<any>();
  public isLoading = false;
  public error: null | string = null;

  constructor(private authService: AuthService, private router: Router) {
  }

  loginHandler(form: NgForm): void {
    const {email, password} = form.value;
    console.assert(isNotNullOrUndefined(email), 'Email has to be Defined and Non Null');
    console.assert(isNotNullOrUndefined(password), 'Password has to be Defined and Non Null');
    this.isLoading = true;
    const sub = this.authService.post('/auth/sign-in', {email, password}).subscribe((data) => {
      const {user} = data;
      this.error = null;
      this.authService.setUser(user);
      this.isLoading = false;
      form.controls?.password?.reset();
      sub.unsubscribe();
      void this.router.navigateByUrl('/');
    }, err => {
      form.controls.password.reset();
      this.isLoading = false;
      if (err?.error?.message) {
        this.error = err.error.message;
      } else {
        this.error = 'Something went wrong';
      }
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
  }

}
