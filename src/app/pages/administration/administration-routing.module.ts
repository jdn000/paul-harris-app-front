import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdministrationComponent } from './administration.component';
import { UserComponent } from './user/user.component';
import { SystemParametersComponent } from './system-parameters/system-parameters.component';

const routes: Routes = [
    {
        path: '',
        component: AdministrationComponent,
        children: [
            {
                path: 'user',
                component: UserComponent,
            },
            {
                path: 'system-parameters',
                component: SystemParametersComponent,
            },

        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdministrationRoutingModule {
}
