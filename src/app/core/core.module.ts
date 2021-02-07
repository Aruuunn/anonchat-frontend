import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AuthModule} from '../auth/auth.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    AuthModule
  ]
})
export class CoreModule {
}
