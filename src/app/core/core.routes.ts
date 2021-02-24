import {Route} from '@angular/router';
import {AcceptInvitationComponent} from './pages/accept-invitation/accept-invitation.component';
import {WelcomeComponent} from './pages/welcome/welcome.component';
import {InvitationDetailsResolver} from './resolvers/invitation-details.resolver';
import {AuthGuard} from './services/auth/auth.guard';


export const coreRoutes: Route[] = [
  {
    path: 'accept-invitation/:invitationId', component: AcceptInvitationComponent,
    resolve: {
      invitationDetails: InvitationDetailsResolver
    },
    canActivate: [AuthGuard]
  },
  {path: 'welcome', component: WelcomeComponent}
];
