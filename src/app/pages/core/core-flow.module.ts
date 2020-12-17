import { NgModule, LOCALE_ID } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbDialogModule,
  NbIconModule,
  NbPopoverModule,
  NbSpinnerModule,
  NbTabComponent,
  NbTabsetModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { ThemeModule } from '../../@theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule as ngFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FilterPipe } from './filter.pipe';

import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { CdkTableModule } from '@angular/cdk/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CoreFLowComponent } from './core-flow.component';
import { CoreRoutingModule } from './core-routing.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';


import { MatDaterangepickerModule } from 'mat-daterangepicker';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { AlumnComponent } from './alumn/alumn.component';
import { DialogAlumnComponent } from './alumn/dialog-alumn/dialog-alumn.component';
import { LearningObjectiveComponent } from './learning-objective/learning-objective.component';
import { DialogLearningObjectiveComponent } from './learning-objective/dialog-learning-objective/dialog-learning-objective.component';
import { CalificationComponent } from './calification/calification.component';

import { SubjectComponent } from '../administration/subject/subject.component';
import { GradeComponent } from '../administration/grade/grade.component';
import { DialogCalificationComponent } from './calification/dialog-calification/dialog-calification.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CummulativeComponent } from './calification/cummulative/cummulative.component';
import { ReportsComponent } from './reports/reports.component';
import { ResultComponent } from './result/result.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

registerLocaleData(localeEs, 'es-ES');

const materialModules = [
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatRadioModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatDialogModule,
  MatSnackBarModule,
  MatListModule,
  MatGridListModule,
  MatBadgeModule,
  MatTooltipModule,
  MatAutocompleteModule,
  MatIconModule,
  MatTableModule,
  MatProgressSpinnerModule,
  MatChipsModule,
  MatDaterangepickerModule, MatTabsModule
];

@NgModule({
  declarations: [
    CoreFLowComponent,
    FilterPipe,
    AlumnComponent,
    DialogAlumnComponent,
    LearningObjectiveComponent,
    DialogLearningObjectiveComponent,
    CalificationComponent,
    SubjectComponent,
    GradeComponent,
    DialogCalificationComponent,
    CummulativeComponent,
    ReportsComponent,
    ResultComponent

  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'es-CL',
    },
  ],
  imports: [
    ThemeModule,
    NbCardModule,
    NbButtonModule,
    NbDialogModule,
    NbIconModule,
    ngFormsModule,
    NbEvaIconsModule,
    ReactiveFormsModule,
    ...materialModules,
    CoreRoutingModule,
    Ng2SmartTableModule,
    NbPopoverModule,
    SweetAlert2Module,
    CdkTableModule,
    NbSpinnerModule,
    NgxChartsModule,
    NbTabsetModule
  ],
})
export class CoreFlowModule { }
