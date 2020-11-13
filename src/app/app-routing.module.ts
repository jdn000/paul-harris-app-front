import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NgxLoginComponent } from './auth/login/login.component';
import { AuthGuard } from './guards/auth-guard.service';

import {
  NbAuthComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';

export const routes: Routes = [
  {
    path: 'pages',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  },
  { path: '',
    component: NbAuthComponent,
    children: [
      { path: '', component: NgxLoginComponent },
      { path: 'login', component: NgxLoginComponent },
      { path: 'register', component: NbRegisterComponent },
      { path: 'logout', component: NbLogoutComponent },
      { path: 'request-password', component: NbRequestPasswordComponent },
      { path: 'reset-password', component: NbResetPasswordComponent },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },

];

const config: ExtraOptions = {
  useHash: false,
};

  @NgModule({
    imports: [RouterModule.forRoot(routes, config)],
    exports: [RouterModule],
  })
  export class AppRoutingModule {
  }
