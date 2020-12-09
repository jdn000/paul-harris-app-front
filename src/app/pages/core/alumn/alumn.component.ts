import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AlumnService } from '../../../services/alumn.service';
import { Alumn } from '../../../models/alumn';

import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { MatDialog } from '@angular/material/dialog';
import { ButtonToggleDisabledComponent } from '../../../@theme/components/table-render/ToggleDisabledButton.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastService } from '../../../services/toast.service';
import { DialogAlumnComponent } from './dialog-alumn/dialog-alumn.component';
import { GradeService } from '../../../services/grade.service';
import { Grade } from '../../../models/Grade';
import { MatSelectionListChange } from '@angular/material/list';
import _ from 'lodash';
//import { DialogUserManagerComponent } from './dialog-user-manager/dialog-user-manager.component';

@Component({
  selector: 'ngx-alumn',
  templateUrl: './alumn.component.html',
  styleUrls: ['./alumn.component.scss']
})
export class AlumnComponent implements OnInit, AfterViewInit {

  constructor(
    private readonly alumnService: AlumnService,
    private readonly toastService: ToastService,
    private readonly dialog: MatDialog,
    private readonly ngxService: NgxUiLoaderService,
    private readonly gradeService: GradeService,

  ) { }
  loading = false;
  alumns: Alumn[] = [];
  alumnData: Alumn = {} as Alumn;
  grades: Grade[] = [];
  selectedGrades: Grade[] = [];
  filteredAlumns: Alumn[] = [];
  async ngOnInit() {
    this.ngxService.startLoader('loader');
    await this.load();
    this.ngxService.stopLoader('loader');
  }
  async load() {
    try {
      this.grades = await this.gradeService.getAll().toPromise();
      this.alumns = await this.alumnService.getAll().toPromise();
      this.filteredAlumns = this.alumns;
      this.selectedGrades = this.grades;
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }

  compareFunction = (o1: any, o2: any) => o1.id === o2.id;
  async onSelectedTurn(evt: any) {
    try {
      this.filteredAlumns = [];
      for (const t of evt.value) {
        if (t) {
          const filteredsByGrade = this.alumns.filter((a) => a.gradeId === t);
          this.filteredAlumns.push(...filteredsByGrade);
        }
      }
      if (!evt.value.length) {

        this.filteredAlumns = this.alumns;
      }
      this.filteredAlumns = _.uniqBy(this.filteredAlumns, 'id');
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }
  ngAfterViewInit(): void {
    this.smartTable.edit.subscribe((dataObject: any) => {
      this.alumnData = dataObject['data'];
      this.openDialog();
    });
    this.smartTable.create.subscribe((dataObject: any) => {
      this.alumnData = null;
      this.openDialog();
    });

  }
  openDialog(): void {
    this.dialog.open(DialogAlumnComponent, {
      data: {
        allAlumns: this.alumns,
        alumn: this.alumnData,
        title: this.alumnData ? 'Actualizar Alumno' : 'Nuevo Alumno',
        buttonTitle: this.alumnData ? 'ACTUALIZAR' : 'CREAR',
        grades: this.grades
      },
      width: '40%',
      disableClose: true,
      panelClass: 'custom-modalbox',
    }).afterClosed().subscribe(async (data) => {
      if (data) {
        await this.load();
      }
    });
  }
  @ViewChild('table') smartTable: Ng2SmartTableComponent;

  settings = {
    mode: 'external',
    actions: {
      position: 'right',
      columnTitle: 'Acción',
      delete: false,
    },

    add: {
      addButtonContent: '<i class="nb-plus"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    columns: {

      lastName: {
        title: 'Apellido Paterno',
        type: 'string',
      },
      secondSurname: {
        title: 'Apellido Materno',
        type: 'string',
      },
      names: {
        title: 'Nombres',
        type: 'string',
      },
      run: {
        title: 'RUN',
        type: 'string',
      },

      gradeId: {
        title: 'Curso',
        type: 'string',
        valuePrepareFunction: (cell, row) => {
          return (this.grades.find((g) => g.id === cell)).description;
        },
      },

    },
  };
}
