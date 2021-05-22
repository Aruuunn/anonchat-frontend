import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { HttpService } from './services/http/http.service';
import { AuthGuard } from './services/auth/auth.guard';
import { AuthService } from './services/auth/auth.service';
import { HomeComponent } from './pages/home/home.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { ChatStorage } from './services/chat/storages/chat-storage';
import { TutorialService } from './services/tutorial/tutorial.service';
import { TutorialComponent } from './components/tutorial/tutorial.component';
import { WebsocketsService } from './services/websockets/websockets.service';
import { InvitationDetailsResolver } from './resolvers/invitation-details.resolver';
import { LoadingStateService } from './services/loading-state/loading-state.service';
import { SideBarComponent } from './pages/home/components/side-bar/side-bar.component';
import {
  ChatService,
  CHAT_STORAGE_INJECTION_TOKEN,
} from './services/chat/chat.service';
import { AllChatsComponent } from './pages/home/components/all-chats/all-chats.component';
import { ChatSpaceComponent } from './pages/home/components/chat-space/chat-space.component';
import { InvitationModalService } from './services/invitation-modal/invitation-modal.service';
import {
  USER_SERVICE_STORAGE_INJECTION_TOKEN,
  UserService,
} from './services/user/user.service';
import { AcceptInvitationComponent } from './pages/accept-invitation/accept-invitation.component';
import {
  MESSAGES_STORAGE_INJECTION_TOKEN,
  MessagesStorage,
} from './services/chat/storages/messages-storage';
import { ShareInvitationComponent } from './pages/home/components/share-invitation-modal/share-invitation.component';

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
    HttpService,
    InvitationDetailsResolver,
    ChatService,
    AuthGuard,
    LoadingStateService,
    TutorialService,
    InvitationModalService,
    WebsocketsService,
    {
      provide: USER_SERVICE_STORAGE_INJECTION_TOKEN,
      useValue: localStorage,
    },
    {
      provide: CHAT_STORAGE_INJECTION_TOKEN,
      useValue: localStorage,
    },
    {
      provide: CHAT_STORAGE_INJECTION_TOKEN,
      useClass: ChatStorage,
    },
    {
      provide: MESSAGES_STORAGE_INJECTION_TOKEN,
      useClass: MessagesStorage,
    },
  ],
  exports: [
    HomeComponent,
    HomeComponent,
    AllChatsComponent,
    ChatSpaceComponent,
  ],
})
export class CoreModule {}
