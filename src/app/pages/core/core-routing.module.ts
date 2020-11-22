import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlumnComponent } from './alumn/alumn.component';

import { CoreFLowComponent } from './core-flow.component';
import { LearningObjectiveComponent } from './learning-objective/learning-objective.component';



const routes: Routes = [
    {
        path: '',
        component: CoreFLowComponent,
        children: [

            {
                path: 'alumn',
                component: AlumnComponent,
            },
            {
                path: 'objective',
                component: LearningObjectiveComponent,
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
