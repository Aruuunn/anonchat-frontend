import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { coreRoutes } from './core/core.routes';
import { HomeComponent } from './core/pages/home/home.component';
import { AuthGuard } from './core/services/auth/auth.guard';

const routes: Routes = [
  ...coreRoutes,
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
