import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {coreRoutes} from './core/core.routes';
import {HomeComponent} from './core/pages/home/home.component';

const routes: Routes = [
  ...coreRoutes,
  {path: '', component: HomeComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
