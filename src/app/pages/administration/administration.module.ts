import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbDialogModule,
  NbIconModule,
  NbPopoverModule,
  NbSpinnerModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { ThemeModule } from '../../@theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule as ngFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
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
import { ButtonBadgeComponent } from '../../@theme/components/table-render/ButtonBadgeComponentRender.component';
import { ButtonToggleUserComponent } from '../../@theme/components/table-render/ButtonToggleUserRender.component';
import { AdministrationComponent } from './administration.component';
import { AdministrationRoutingModule } from './administration-routing.module';
import { UserComponent } from './user/user.component';
import { DialogUserManagerComponent } from './user/dialog-user-manager/dialog-user-manager.component';
import { DialogChangePasswordComponent } from './user/dialog-change-password/dialog-change-password.component';
import { ChangePasswordComponent } from '../../@theme/components/table-render/ChangePasswordComponentRender.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ToggleOrTextComponent } from '../../@theme/components/table-render/ToggleOrText.component';
import { DialogUserSubjectComponent } from './user/dialog-user-subject/dialog-user-subject.component';
import { SemesterComponent } from './semester/semester.component';
import { DialogSemesterComponent } from './semester/dialog-semester/dialog-semester.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDaterangepickerModule } from 'mat-daterangepicker';
import { DialogGradeManagerComponent } from './grade/dialog-grade-manager/dialog-grade-manager.component';
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
    AdministrationComponent,
    ButtonBadgeComponent,
    ButtonToggleUserComponent,
    UserComponent,
    DialogUserManagerComponent,
    DialogChangePasswordComponent,
    ChangePasswordComponent,
    ToggleOrTextComponent,
    DialogUserSubjectComponent,
    SemesterComponent,
    DialogSemesterComponent,
    DialogGradeManagerComponent,


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
    AdministrationRoutingModule,
    Ng2SmartTableModule,
    NbPopoverModule,
    SweetAlert2Module,
    NbSpinnerModule
  ],
})
export class AdministrationModule { }
