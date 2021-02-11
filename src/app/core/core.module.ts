import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AuthService} from './auth/auth.service';
import {HomeComponent} from './pages/home/home.component';
import {HomeShellComponent} from './pages/home/home-shell.component';
import {AllChatsComponent} from './pages/home/all-chats.component';
import {ChatSpaceComponent} from './pages/home/chat-space.component';
import {AcceptInvitationComponent} from './pages/home/accept-invitation.component';
import {SharedModule} from '../shared/shared.module';
import {WelcomeComponent} from './pages/welcome/welcome.component';


@NgModule({
  declarations: [
    HomeComponent,
    HomeShellComponent,
    AllChatsComponent,
    ChatSpaceComponent,
    AcceptInvitationComponent,
    WelcomeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
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
