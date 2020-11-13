import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { AdministrationModule } from './administration/administration.module';
import { CoreFlowModule } from './core/core-flow.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    MiscellaneousModule,
    ConfigurationModule,
    AdministrationModule,
    CoreFlowModule,
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
