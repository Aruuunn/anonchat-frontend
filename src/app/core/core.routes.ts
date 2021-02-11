import {Route} from '@angular/router';
import {AcceptInvitationComponent} from './pages/accept-invitation/accept-invitation.component';
import {WelcomeComponent} from './pages/welcome/welcome.component';
import {InvitationDetailsResolver} from './resolvers/invitation-details.resolver';


export const coreRoutes: Route[] = [
  {
    path: 'accept-invitation/:invitationId', component: AcceptInvitationComponent,
    resolve: {
      invitationDetails: InvitationDetailsResolver
    }
  },
  {path: 'welcome', component: WelcomeComponent}
];
