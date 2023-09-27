import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { NbAuthModule, NbPasswordAuthStrategy, NbAuthJWTToken } from '@nebular/auth';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { of as observableOf } from 'rxjs';
import { throwIfAlreadyLoaded } from './module-import-guard';
import {
  LayoutService,
  SeoService,
  StateService,
} from './utils';
import { RippleService } from './utils/ripple.service';
import { environment } from '../../environments/environment';

const DATA_SERVICES = [
  { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useExisting: RippleService },
];

export class NbSimpleRoleProvider extends NbRoleProvider {
  getRole() {
    // here you could provide any role based on any auth flow
    //hello
    return observableOf('guest');
  }
}

export const NB_CORE_PROVIDERS = [
  ...DATA_SERVICES,
  ...NbAuthModule.forRoot({
    strategies: [
      NbPasswordAuthStrategy.setup({
        name: 'auth',
        baseEndpoint: environment.apiUrl,
        token: {
          class: NbAuthJWTToken,
          key: 'data.token',
        },
        login: {
          endpoint: '/auth/signin',
          method: 'post',
          redirect: {
            success: '/pages/dashboard',
            failure: null,
          },
          defaultErrors: ['usuario/contraseña incorrectos, intente nuevamente.'],
          defaultMessages: ['Autenticación correcta'],
        },
        logout: {
          endpoint: '/auth/sign-out',
          method: 'post',
          defaultErrors: ['Algo salió mal, por favor intente de nuevo.'],
          defaultMessages: ['Sesión terminada correctamente.']
        }
      }),
    ],
    forms: {
      login: {
        redirectDelay: 50,
        strategy: 'auth',  // strategy id key.
        rememberMe: false,
        showMessages: {
          success: true,
          error: true,
        }
      },
      logout: {
        strategy: 'auth',
      },
      validation: {
        username: {
          required: true
        },
        password: {
          required: true,
          minLength: 4,
          maxLength: 50,
        },
      }
    },
  }).providers,

  NbSecurityModule.forRoot({
    accessControl: {
      guest: {
        view: '*',
      },
      user: {
        parent: 'guest',
        create: '*',
        edit: '*',
        remove: '*',
      },
    },
  }).providers,
  {
    provide: NbRoleProvider, useClass: NbSimpleRoleProvider,
  },
  LayoutService,
  SeoService,
  StateService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    NbAuthModule,
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}
