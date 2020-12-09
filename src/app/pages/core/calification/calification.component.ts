import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { NgxUiLoaderService } from 'ngx-ui-loader'; import { Alumn } from '../../../models/alumn';

import { BatchCalifications, Calification, CalificationTemplate } from '../../../models/calification';
import { Grade } from '../../../models/Grade';
import { Subject } from '../../../models/subject';
import { AlumnService } from '../../../services/alumn.service';
import { CalificationService } from '../../../services/calification.service';
import { GradeService } from '../../../services/grade.service';
import { SubjectService } from '../../../services/subject.service';
import { ToastService } from '../../../services/toast.service';
import _ from 'lodash';
import { MatPaginator } from '@angular/material/paginator';
import 'rxjs/add/observable/of';
import { MatTableDataSource } from '@angular/material/table';
import { DialogCalificationComponent } from './dialog-calification/dialog-calification.component';
import { Router, NavigationExtras } from '@angular/router';
@Component({
  selector: 'ngx-calification',
  templateUrl: './calification.component.html',
  styleUrls: ['./calification.component.scss']
})
export class CalificationComponent implements OnInit {

  constructor(
    private readonly calificationService: CalificationService,
    private readonly toastService: ToastService,
    private readonly dialog: MatDialog,
    private readonly ngxService: NgxUiLoaderService,
    private readonly gradeService: GradeService,
    private readonly alumnService: AlumnService,
    private readonly subjectService: SubjectService,
    private readonly router: Router,
  ) {
    if (typeof this.router.getCurrentNavigation().extras.state !== 'undefined') {
      this.redirect.gradeId = this.router.getCurrentNavigation().extras.state.gradeId;
      this.redirect.subjectId = this.router.getCurrentNavigation().extras.state.subjectId;
      this.redirect.calificationNumber = this.router.getCurrentNavigation().extras.state.subjectId;
      this.useBreadcrumb = true;
      this.disableSelection = true;
    }

  }
  redirect = {
    calificationNumber: null,
    gradeId: null,
    subjectId: null
  };
  useBreadcrumb = false;
  batchCalifications: BatchCalifications;
  califications: Calification[] = [];
  disableSelection = false;
  cummulativeCalifications: Calification[] = [];
  grades: Grade[] = [];
  displayedColumns: string[] = ['alumnFullName'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  cummulativeColumnsToDisplay: string[] = this.displayedColumns.slice();
  // dataSource = new MatTableDataSource<Alumn>([]);
  selectedGrades: Grade[] = [];
  selectedGrade: Grade = {} as Grade;
  subjects: Subject[] = [];
  selectedSubject: Subject = {} as Subject;
  alumns: Alumn[] = [];


  disableSubjectSelect = true;
  editAlumnCalifications = false;
  alumnData: Alumn = {} as Alumn;
  filteredAlumns: Alumn[] = [];
  columns: any;
  alumnCalifications: AlumnCalifications[] = [];

  mapArray = [];
  dataSource = new MatTableDataSource<AlumnCalifications>([]);
  calificationTemplate: CalificationTemplate[];// a eliminar
  calificationNumber: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  async ngOnInit() {
    this.ngxService.startLoader('loader');
    this.grades = await this.gradeService.getAll().toPromise();
    this.subjects = await this.subjectService.getAll().toPromise();
    this.alumns = await this.alumnService.getAll().toPromise();
    this.filteredAlumns = this.alumns;
    this.selectedGrades = this.grades;
    this.dataSource.data = [];
    if (this.useBreadcrumb) {
      this.getInfoFromBreadCrumb();
    }
    // this.columnsToDisplay = this.displayedColumns.slice();
    // this.califications = await this.calificationService.getAll().toPromise();
    await this.load();
    this.ngxService.stopLoader('loader');
  }
  enableSelectLists() {
    this.disableSelection = false;
  }
  async load() {
    try {
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }
  addColumn() {
    this.columnsToDisplay.push(this.displayedColumns[3]);
  }
  removeColumn() {
    if (this.columnsToDisplay.length) {
      this.columnsToDisplay.pop();
    }
  }

  compareFunction = (o1: any, o2: any) => o1.id === o2.id;

  async onSelectedGrade(evt: any) {
    try {
      this.filteredAlumns = [];
      this.disableSubjectSelect = false;
      if (evt.value) {
        const filteredsByGrade = this.alumns.filter((a) => a.gradeId === evt.value); // separa a los alumnos del curso seleccionado
        this.filteredAlumns.push(...filteredsByGrade);
        this.selectedGrade = this.selectedGrades.find((i) => i.id === evt.value); //selecciona id de asignatura
      } else {
        this.filteredAlumns = this.alumns;
      }
      this.filteredAlumns = _.uniqBy(this.filteredAlumns, 'id'); // se asegura de que los alumnos sean unicos
      this.alumnCalifications = this.filteredAlumns.map((alumn) => {
        return {
          alumnFullName: `${alumn.lastName} ${alumn.secondSurname} ${alumn.names} `,
          alumnId: alumn.id
        };
      });

      if (this.selectedSubject.id) {
        this.getCalificationInfo(this.selectedGrade.id, this.selectedSubject.id);
      }
      this.dataSource = new MatTableDataSource<AlumnCalifications>(this.alumnCalifications);
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }
  clean() {
    this.alumnCalifications = [];

  }
  editCalifications() {
    this.editAlumnCalifications = !this.editAlumnCalifications;
  }
  async onSelectedSubject(evt: any) {
    try {
      this.columnsToDisplay = this.displayedColumns.slice();
      if (evt.value) {
        this.selectedSubject = this.subjects.find((s) => s.id === evt.value);
        this.getCalificationInfo(this.selectedGrade.id, this.selectedSubject.id);
      }
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }

  async getCalificationInfo(gradeId: number, subjectId: number) {
    this.califications = [];
    this.cummulativeCalifications = [];
    this.columnsToDisplay = this.displayedColumns.slice();
    this.cummulativeColumnsToDisplay = this.displayedColumns.slice();
    this.califications = await this.calificationService.getByGradeAndSubjectId(gradeId, subjectId).toPromise();
    let maxvalue = Math.max(...this.califications.map(elt => elt.evaluationNumber));
    this.calificationNumber = maxvalue >= 0 ? maxvalue : 0;
    for (let i = 0; i < maxvalue; i++) {
      this.columnsToDisplay.push(`N${i + 1}`);
    }
    this.alumnCalifications.forEach(async (alumn) => {
      const foundedCalifications = this.califications.filter((c) => c.alumnId === alumn.alumnId);
      let count = 0;
      let total = 0;
      alumn.avg = 0;
      if (foundedCalifications.length) {
        for (let i = 1; i <= 15; i++) {
          const founded = foundedCalifications.find((calification) => Number(calification.evaluationNumber) === i);
          if (founded) {
            if (founded.isCummulative) {
              founded.value = await this.getCummulativeValue(founded.calificationId, founded.alumnId);
            }
            alumn[`N${i}`] = founded.value;// si es acumulativa, buscar valores en los dto
            alumn[`N${i}Id`] = founded.id;
            alumn[`N${i}Cummulative`] = founded.isCummulative ? true : false;
            total += founded.value;
            count += 1;
          } else {
            alumn[`N${i}`] = null;
            alumn[`N${i}Id`] = null;
          }
        }
        alumn.avg = count > 0 ? (total / count) : 0;
      }
    });
    console.log(this.alumnCalifications);
    this.columnsToDisplay.push('avg');
  }
  openDialog(): void {

    let calificationsToSelect = _.uniqBy(this.califications, 'evaluationNumber');
    console.log(calificationsToSelect);
    this.dialog.open(DialogCalificationComponent, {
      data: {
        allAlumns: this.filteredAlumns,
        title: 'Nueva Calificación',
        buttonTitle: 'CREAR',
        grade: this.selectedGrade,
        subjectId: this.selectedSubject ? this.selectedSubject.id : 1,
        calificationNumber: this.calificationNumber + 1,
        calificationsToSelect: calificationsToSelect ? calificationsToSelect : []
      },
      width: '40%',
      disableClose: true,
      panelClass: 'custom-modalbox',
    }).afterClosed().subscribe(async (data) => {
      if (data) {
        this.editAlumnCalifications = true;
        this.getCalificationInfo(this.selectedGrade.id, this.selectedSubject.id);

      }
    });
  }

  async updateCalifications() {
    try {
      let calificationsToUpdate = [];
      this.alumnCalifications.forEach((c) => {
        for (let i = 1; i <= 15; i++) {
          if (c[`N${i}`]) {
            calificationsToUpdate.push({
              id: c[`N${i}Id`],
              value: c[`N${i}`]
            });
          }
        }
      }
      );
      const updated = await this.calificationService.update(calificationsToUpdate).toPromise();
      updated ? this.toastService.showSuccess('actualizadas') : this.toastService.showError('no se pudo actualizar');
      this.editAlumnCalifications = false;
      this.getCalificationInfo(this.selectedGrade.id, this.selectedSubject.id);
    } catch (error) {
    }
  }

  redirectingCalifications(evt: number, edit: boolean) {
    const x = this.califications.find((c) => Number(c.evaluationNumber) === evt);
    const navigationExtras: NavigationExtras = {
      state: {
        calificationNumber: x.calificationId,
        gradeId: x.gradeId,
        subjectId: x.subjectId,
        editAlumnCalifications: edit
      }
    };
    this.router.navigate(['pages/core/cummulativeCalification'], navigationExtras);
  }

  async getCummulativeValue(calificationId: number, alumnId: number) {
    let values = await this.calificationService.getCummulativeByCalificationIdAlumnId(calificationId, alumnId).toPromise();
    let total = 0;

    values.forEach((v) => {
      total += v.value;
    });
    return total > 0 ? total / values.length : 0;
  }
  async getInfoFromBreadCrumb() {
    const subject = {
      value: this.redirect.subjectId
    };
    const grade = {
      value: this.redirect.gradeId
    };
    this.onSelectedGrade(grade);
    this.onSelectedSubject(subject);
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
export interface AlumnCalifications {
  alumnFullName: string;
  alumnId: number;
  N1?: number;
  N1Id?: number;
  N1Cummulative?: boolean;
  N2?: number;
  N2Id?: number;
  N2Cummulative?: boolean;
  N3?: number;
  N3Id?: number;
  N3Cummulative?: boolean;
  N4?: number;
  N4Id?: number;
  N4Cummulative?: boolean;
  N5?: number;
  N5Id?: number;
  N5Cummulative?: boolean;
  N6?: number;
  N6Id?: number;
  N6Cummulative?: boolean;
  N7?: number;
  N7Id?: number;
  N7Cummulative?: boolean;
  N8?: number;
  N8Id?: number;
  N8Cummulative?: boolean;
  N9?: number;
  N9Id?: number;
  N9Cummulative?: boolean;
  N10?: number;
  N10Id?: number;
  N10Cummulative?: boolean;
  N11?: number;
  N11Id?: number;
  N11Cummulative?: boolean;
  N12?: number;
  N12Id?: number;
  N12Cummulative?: boolean;
  N13?: number;
  N13Id?: number;
  N13Cummulative?: boolean;
  N14?: number;
  N14Id?: number;
  N14Cummulative?: boolean;
  N15?: number;
  N15Id?: number;
  N15Cummulative?: boolean;
  avg?: number;
}


/**
 * main admin: mantenedor general con select para elegir todo
 *
 * se selecciona curso, asignatura
 *
 *fila alumnos, columna notas-> nueva nota... etc

 con rol, funciona el menú izquierdo por curso opcional como acceso directo

 con admin, desactiva menú izquierdo y muestra todo




 *
 */