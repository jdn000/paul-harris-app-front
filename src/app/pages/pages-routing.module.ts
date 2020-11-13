import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'configuration',
      loadChildren: () => import('./configuration/configuration.module')
        .then(m => m.ConfigurationModule),
    },
    {
      path: 'administration',
      loadChildren: () => import('./administration/administration.module')
        .then(m => m.AdministrationModule),
    },
    {
      path: 'core',
      loadChildren: () => import('./core/core-flow.module')
        .then(m => m.CoreFlowModule),
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
