import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {authRoutes} from './auth/auth-routes';
import {coreRoutes} from './core/core-routing';

const routes: Routes = [
  {
    path: 'auth', component: AuthComponent, children: [
      ...authRoutes
    ]
  },
  ...coreRoutes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
