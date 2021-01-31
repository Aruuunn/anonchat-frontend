import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SignalModule} from '../../projects/signal/src/lib/signal.module';
import {SignalService} from '../../projects/signal/src/lib/signal.service';
import {AuthModule} from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SignalModule,
    AuthModule,
  ],
  providers: [SignalService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
