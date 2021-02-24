import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthService} from './services/auth/auth.service';
import {HomeComponent} from './pages/home/home.component';
import {AllChatsComponent} from './pages/home/all-chats.component';
import {ChatSpaceComponent} from './pages/home/chat-space.component';
import {AcceptInvitationComponent} from './pages/accept-invitation/accept-invitation.component';
import {SharedModule} from '../shared/shared.module';
import {WelcomeComponent} from './pages/welcome/welcome.component';
import {FormsModule} from '@angular/forms';
import {USER_SERVICE_STORAGE_INJECTION_TOKEN, UserService} from './services/user/user.service';
import {ShareInvitationComponent} from './pages/home/share-invitation.component';
import {HttpService} from './services/http/http.service';
import {InvitationDetailsResolver} from './resolvers/invitation-details.resolver';
import {ChatService} from './services/chat/chat.service';
import {AuthGuard} from './services/auth/auth.guard';
import {LoadingStateService} from './services/loading-state/loading-state.service';


@NgModule({
  declarations: [
    HomeComponent,
    HomeComponent,
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
    },
    HttpService,
    InvitationDetailsResolver,
    ChatService,
    AuthGuard,
    LoadingStateService
  ],
  exports: [
    HomeComponent,
    HomeComponent,
    AllChatsComponent,
    ChatSpaceComponent,
  ]
})
export class CoreModule {
}
