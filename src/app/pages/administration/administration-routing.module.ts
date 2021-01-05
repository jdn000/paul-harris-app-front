import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdministrationComponent } from './administration.component';
import { UserComponent } from './user/user.component';
import { GradeComponent } from './grade/grade.component';
import { SubjectComponent } from './subject/subject.component';
import { RoleGuardService as RoleGuard } from '../../guards/role-guard.service';
import { SemesterComponent } from './semester/semester.component';
const routes: Routes = [
    {
        path: '',
        component: AdministrationComponent,
        children: [
            {
                path: 'user',
                component: UserComponent,
                canActivate: [RoleGuard],
                data: {
                    roleId: 1,
                },
            },
            {
                path: 'grade',
                component: GradeComponent,
                canActivate: [RoleGuard],
                data: {
                    roleId: 1,
                },
            },
            {
                path: 'subject',
                component: SubjectComponent,
                canActivate: [RoleGuard],
                data: {
                    roleId: 1,
                },
            },
            {
                path: 'semester',
                component: SemesterComponent,
                canActivate: [RoleGuard],
                data: {
                    roleId: 1,
                },
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
