import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthComponent} from './auth.component';
import {LoginComponent} from './pages/login/login.component';
import {SignupComponent} from './pages/signup/signup.component';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {IsRetypedPasswordEqualDirective} from './directives/is-retyped-password-equal.directive';
import {RouterModule} from '@angular/router';
import {AuthService} from './auth.service';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    SignupComponent,
    IsRetypedPasswordEqualDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule,
  ],
  providers: [AuthService],
  exports: [AuthComponent, LoginComponent, SignupComponent]
})
export class AuthModule {
}
