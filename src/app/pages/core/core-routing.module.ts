import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoreFLowComponent } from './core-flow.component';
import { PatientComponent } from './patient/patient.component';


const routes: Routes = [
    {
        path: '',
        component: CoreFLowComponent,
        children: [

            {
                path: 'patient',
                component: PatientComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CoreRoutingModule {
}
