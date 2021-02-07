import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpService} from '../../../shared/http/http.service';
import {UserService} from '../../../shared/user/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../../../../styles/palette.scss', '../../../../styles/common.scss']
})
export class SignupComponent implements OnInit {
  public isLoading = false;
  public error: string | null = null;

  constructor(private httpService: HttpService, private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
  }

  submitHandler(form: NgForm): void {
    this.isLoading = true;
    const {fullname: name, email, password} = form.value;
    const sub = this.httpService.post('/auth/sign-up', {name, email, password}).subscribe((data) => {
      this.error = null;
      const {user} = data;
      this.userService.setUser(user);
      this.isLoading = false;
      sub.unsubscribe();
      void this.router.navigateByUrl('/');
    }, (err) => {
      if (err?.error?.message) {
        this.error = err.error.message;
      } else {
        this.error = 'Something Went Wrong';
      }
      sub.unsubscribe();
      this.isLoading = false;
    });
  }

}
