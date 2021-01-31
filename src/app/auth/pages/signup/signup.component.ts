import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../../../../styles/palette.scss', '../../../../styles/common.scss']
})
export class SignupComponent implements OnInit {
  public isLoading = false;
  public error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
  }

  submitHandler(form: NgForm): void {
    this.isLoading = true;
    const {fullname: name, email, password} = form.value;
    const sub = this.authService.post('/auth/sign-up', {name, email, password}).subscribe((data) => {
      this.error = null;
      const {user} = data;
      this.authService.setUser(user);
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
