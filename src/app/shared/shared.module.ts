import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleNavbarComponent } from './simple-navbar/simple-navbar.component';



@NgModule({
  declarations: [SimpleNavbarComponent],
  exports: [
    SimpleNavbarComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
