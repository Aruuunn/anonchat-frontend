import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthService} from './auth/auth.service';
import {HomeComponent} from './pages/home/home.component';
import {HomeShellComponent} from './pages/home/home-shell.component';
import {AllChatsComponent} from './pages/home/all-chats.component';
import {ChatSpaceComponent} from './pages/home/chat-space.component';
import {AcceptInvitationComponent} from './pages/home/accept-invitation.component';
import {SharedModule} from '../shared/shared.module';
import {WelcomeComponent} from './pages/welcome/welcome.component';
import {FormsModule} from '@angular/forms';
import {USER_SERVICE_STORAGE_INJECTION_TOKEN, UserService} from './user/user.service';
import {ShareInvitationComponent} from './pages/home/share-invitation.component';


@NgModule({
  declarations: [
    HomeComponent,
    HomeShellComponent,
    AllChatsComponent,
    ChatSpaceComponent,
    AcceptInvitationComponent,
    WelcomeComponent,
    ShareInvitationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ],
  providers: [
    AuthService,
    UserService,
    {
      provide: USER_SERVICE_STORAGE_INJECTION_TOKEN,
      useValue: localStorage
    }
  ],
  exports: [
    HomeComponent,
    HomeShellComponent,
    AllChatsComponent,
    ChatSpaceComponent,
  ]
})
export class CoreModule {
}
