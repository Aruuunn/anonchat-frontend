import { BrowserModule } from '@angular/platform-browser';
import { forwardRef, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignalModule } from '../../projects/signal/src/lib/signal.module';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { AuthService } from './core/services/auth/auth.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SignalModule,
    HttpClientModule,
    CoreModule,
  ],
  providers: [forwardRef(() => AuthService)],
  bootstrap: [AppComponent],
})
export class AppModule {}
