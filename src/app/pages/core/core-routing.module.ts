import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlumnComponent } from './alumn/alumn.component';
import { CalificationComponent } from './calification/calification.component';
import { CummulativeComponent } from './calification/cummulative/cummulative.component';

import { CoreFLowComponent } from './core-flow.component';
import { LearningObjectiveComponent } from './learning-objective/learning-objective.component';
import { MyGradeComponent } from './my-grade/my-grade.component';
import { MyGradeCummulativeComponent } from './my-grade/myGradeCummulative/my-grade-cummulative.component';
import { ReportsComponent } from './reports/reports.component';
import { ResultComponent } from './result/result.component';



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
            {
                path: 'calification',
                component: CalificationComponent,
            },
            {
                path: 'cummulativeCalification',
                component: CummulativeComponent,
            },
            {
                path: 'report',
                component: ReportsComponent,
            },
            {
                path: 'result',
                component: ResultComponent,
            },
            {
                path: 'my-grade-cummulativeCalification',
                component: MyGradeCummulativeComponent,
            },
            {
                path: 'my-grade',
                component: MyGradeComponent,
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
