import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { HomeComponent } from './pages/home/home.component';
import { AllChatsComponent } from './pages/home/components/all-chats/all-chats.component';
import { ChatSpaceComponent } from './pages/home/components/chat-space/chat-space.component';
import { AcceptInvitationComponent } from './pages/accept-invitation/accept-invitation.component';
import { SharedModule } from '../shared/shared.module';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { FormsModule } from '@angular/forms';
import {
  USER_SERVICE_STORAGE_INJECTION_TOKEN,
  UserService,
} from './services/user/user.service';
import { ShareInvitationComponent } from './pages/home/components/share-invitation-modal/share-invitation.component';
import { HttpService } from './services/http/http.service';
import { InvitationDetailsResolver } from './resolvers/invitation-details.resolver';
import { ChatService, CHAT_STORAGE_INJECTION_TOKEN } from './services/chat/chat.service';
import { AuthGuard } from './services/auth/auth.guard';
import { LoadingStateService } from './services/loading-state/loading-state.service';
import { SideBarComponent } from './pages/home/components/side-bar/side-bar.component';
import { TutorialComponent } from './components/tutorial/tutorial.component';
import { TutorialService } from './services/tutorial/tutorial.service';
import { InvitationModalService } from './services/invitation-modal/invitation-modal.service';
import { WebsocketsService } from './services/websockets/websockets.service';

@NgModule({
  declarations: [
    HomeComponent,
    HomeComponent,
    AllChatsComponent,
    ChatSpaceComponent,
    AcceptInvitationComponent,
    WelcomeComponent,
    ShareInvitationComponent,
    SideBarComponent,
    TutorialComponent,
  ],
  imports: [CommonModule, SharedModule, FormsModule],
  providers: [
    AuthService,
    UserService,
    {
      provide: USER_SERVICE_STORAGE_INJECTION_TOKEN,
      useValue: localStorage,
    },
    {
      provide: CHAT_STORAGE_INJECTION_TOKEN,
      useValue: localStorage,
    },
    HttpService,
    InvitationDetailsResolver,
    ChatService,
    AuthGuard,
    LoadingStateService,
    TutorialService,
    InvitationModalService,
    WebsocketsService,
  ],
  exports: [
    HomeComponent,
    HomeComponent,
    AllChatsComponent,
    ChatSpaceComponent,
  ],
})
export class CoreModule {}
