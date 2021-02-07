import {forwardRef, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SimpleNavbarComponent} from './components/simple-navbar/simple-navbar.component';
import {AuthModule} from '../auth/auth.module';


@NgModule({
  declarations: [SimpleNavbarComponent],
  exports: [
    SimpleNavbarComponent,
  ],
  imports: [
    CommonModule,
    forwardRef(() => AuthModule)
  ],
  providers: [],
})
export class SharedModule {
}
