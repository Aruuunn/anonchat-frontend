import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthComponent} from './auth.component';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';


@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [AuthComponent, LoginComponent, SignupComponent]
})
export class AuthModule {
}
