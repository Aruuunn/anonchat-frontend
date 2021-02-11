import {Route} from '@angular/router';
import {AcceptInvitationComponent} from './pages/home/accept-invitation.component';
import {WelcomeComponent} from './pages/welcome/welcome.component';


export const coreRoutes: Route[] = [
  {path: 'invitation/:id', component: AcceptInvitationComponent},
  {path: 'welcome', component: WelcomeComponent}
];
