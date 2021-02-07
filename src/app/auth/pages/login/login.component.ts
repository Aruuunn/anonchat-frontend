import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../../shared/user/user.service';
import {HttpService} from '../../../shared/http/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../../../styles/common.scss', '../../../../styles/palette.scss']
})
export class LoginComponent implements OnInit {
  public isLoading = false;
  public error: null | string = null;

  constructor(private httpService: HttpService, private userService: UserService, private router: Router) {
  }

  loginHandler(form: NgForm): void {
    const {email, password} = form.value;
    this.isLoading = true;
    const sub = this.httpService.post('/auth/sign-in', {email, password}).subscribe((data) => {
      const {user} = data;
      this.error = null;
      this.userService.setUser(user);
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
