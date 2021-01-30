import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SignalModule} from '../../projects/signal/src/lib/signal.module';
import {SignalService} from '../../projects/signal/src/lib/signal.service';
import {AuthComponent} from './auth/auth.component';
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SignalModule,
  ],
  providers: [SignalService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
