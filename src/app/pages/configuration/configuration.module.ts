import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbDialogModule,
  NbIconModule,
  NbSpinnerModule
} from '@nebular/theme';
import { CKEditorModule } from 'ng2-ckeditor';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AngularDualListBoxModule } from 'angular-dual-listbox';

import { MatFormFieldModule } from '@angular/material/form-field';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule as ngFormsModule } from '@angular/forms';


import { A11yModule } from '@angular/cdk/a11y';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { OverlayModule } from '@angular/cdk/overlay';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';

import { ToggleCustomerComponent } from '../../@theme/components/table-render/ToggleCustomerRender.component';
import { ButtonToggleComponent } from '../../@theme/components/table-render/ButtonToggleComponentRender.component';
import { TubeComponent } from './tube/tube.component';
import { DialogTubeManagerComponent } from './tube/dialog-tube-manager/dialog-tube-manager.component';
import { ButtonToggleTubeComponent } from '../../@theme/components/table-render/ButtonToggleTubeRender.component';
import { ButtonToggleDisabledComponent } from '../../@theme/components/table-render/ToggleDisabledButton.component';
import { TestComponent } from './test/test.component';
import { DialogTestManagerComponent } from './test/dialog-test-manager/dialog-test-manager.component';
import { TurnComponent } from './turn/turn.component';
import { DialogTurnManagerComponent } from './turn/dialog-turn-manager/dialog-turn-manager.component';
import { ButtonToggleCustomerComponent } from '../../@theme/components/table-render/ButtonToggleCustomerComponentRender.component';

const MATERIAL_MODULES = [
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
  MatProgressSpinnerModule,
  MatListModule,
  MatGridListModule,
  MatBadgeModule,
  MatTabsModule,
  A11yModule,
  ClipboardModule,
  DragDropModule,
  PortalModule,
  ScrollingModule,
  CdkStepperModule,
  CdkTableModule,
  CdkTreeModule,
  MatAutocompleteModule,
  MatBottomSheetModule,
  MatCardModule,
  MatChipsModule,
  MatStepperModule,
  MatDividerModule,
  MatExpansionModule,
  MatIconModule,
  MatMenuModule,
  MatRippleModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatSidenavModule,
  MatSliderModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
  OverlayModule,
];

@NgModule({
  declarations: [
    ConfigurationComponent,

    ToggleCustomerComponent,

    ButtonToggleComponent,
    ButtonToggleDisabledComponent,
    TubeComponent,
    DialogTubeManagerComponent,
    ButtonToggleTubeComponent,
    TestComponent,
    DialogTestManagerComponent,
    TurnComponent,
    DialogTurnManagerComponent,

    ButtonToggleCustomerComponent,

  ],
  imports: [
    ThemeModule,
    NbCardModule,
    NbButtonModule,
    NbEvaIconsModule,
    NbDialogModule,
    NbIconModule,
    ngFormsModule,
    ...MATERIAL_MODULES,
    MatListModule,
    MatGridListModule,
    MatBadgeModule,
    NbEvaIconsModule,
    ReactiveFormsModule,
    ConfigurationRoutingModule,
    Ng2SmartTableModule,
    CKEditorModule,
    AngularDualListBoxModule,
    NbSpinnerModule
  ]
})
export class ConfigurationModule { }
