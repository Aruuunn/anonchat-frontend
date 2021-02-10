import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AuthService} from './auth/auth.service';
import {HomeComponent} from './components/home.component';
import {HomeShellComponent} from './components/home-shell.component';
import {AllChatsComponent} from './components/all-chats.component';
import {ChatSpaceComponent} from './components/chat-space.component';


@NgModule({
  declarations: [
    HomeComponent,
    HomeShellComponent,
    AllChatsComponent,
    ChatSpaceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  providers: [AuthService],
  exports: [
    HomeComponent,
    HomeShellComponent,
    AllChatsComponent,
    ChatSpaceComponent,
  ]
})
export class CoreModule {
}
