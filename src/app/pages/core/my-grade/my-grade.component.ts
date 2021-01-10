import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, NavigationExtras } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { Alumn } from '../../../models/alumn';
import { BatchCalifications, Calification, CalificationTemplate } from '../../../models/calification';
import { Grade } from '../../../models/grade';
import { Subject } from '../../../models/subject';
import { UserSubject } from '../../../models/user';
import { AlumnService } from '../../../services/alumn.service';
import { CalificationService } from '../../../services/calification.service';
import { GradeService } from '../../../services/grade.service';
import { ReportService } from '../../../services/report.service';
import { SubjectService } from '../../../services/subject.service';
import { ToastService } from '../../../services/toast.service';
import { UserSubjectService } from '../../../services/userSubject.service';
import { DialogCalificationComponent } from '../calification/dialog-calification/dialog-calification.component';
import _ from 'lodash';
import { saveAs } from 'file-saver';
import { DialogLearningObjectiveComponent } from '../learning-objective/dialog-learning-objective/dialog-learning-objective.component';
import { DialogMyGradeCalificationComponent } from './dialog-my-grade-calification/dialog-my-grade-calification.component';
import { UserService } from '../../../services/user.service';
@Component({
  selector: 'ngx-my-grade',
  templateUrl: './my-grade.component.html',
  styleUrls: ['./my-grade.component.scss']
})
export class MyGradeComponent implements OnInit {


  constructor(
    private readonly calificationService: CalificationService,
    private readonly toastService: ToastService,
    private readonly dialog: MatDialog,
    private readonly ngxService: NgxUiLoaderService,
    private readonly gradeService: GradeService,
    private readonly alumnService: AlumnService,
    private readonly subjectService: SubjectService,
    private readonly router: Router,
    private readonly reportService: ReportService,

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
  loadingCalifications = false;
  waitingDownload = false;
  reportData: any = {};
  useBreadcrumb = false;
  generated = false;
  batchCalifications: BatchCalifications;
  califications: Calification[] = [];
  disableSelection = false;
  cummulativeCalifications: Calification[] = [];
  grades: Grade[] = [];
  displayedColumns: string[] = ['alumnFullName'];
  columnsToDisplay: string[] = [];
  cummulativeColumnsToDisplay: string[] = this.displayedColumns.slice();

  selectedGrades: Grade[] = [];
  selectedGrade: Grade = {} as Grade;

  subjects: Subject[] = [];
  selectedSubject: Subject = {} as Subject;
  alumns: Alumn[] = [];

  isCummulative = {
    N1: null,
    N1Total: 0,
    N2: null,
    N2Total: 0,
    N3: null,
    N3Total: 0,
    N4: null,
    N4Total: 0,
    N5: null,
    N5Total: 0,
    N6: null,
    N6Total: 0,
    N7: null,
    N7Total: 0,
    N8: null,
    N8Total: 0,
    N9: null,
    N9Total: 0,
    N10: null,
    N10Total: 0,
    N11: null,
    N11Total: 0,
    N12: null,
    N12Total: 0,
    N13: null,
    N13Total: 0,
    N14: null,
    N14Total: 0,
    N15: null,
    N15Total: 0,
  };
  disableSubjectSelect = true;
  editAlumnCalifications = false;
  alumnData: Alumn = {} as Alumn;
  filteredAlumns: Alumn[] = [];
  columns: any;
  alumnCalifications: AlumnCalifications[] = [];
  userSubjects: UserSubject[] = [];

  dataSource = new MatTableDataSource<AlumnCalifications>([]);
  calificationTemplate: CalificationTemplate[];// a eliminar
  calificationNumber: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  async ngOnInit() {
    this.ngxService.startLoader('my');
    const rawGrades = await this.gradeService.getAll().toPromise();
    this.grades = rawGrades.filter((g) => g.headTeacherId === Number(localStorage.getItem('userId')));
    if (!this.grades.length) {
      this.toastService.showInfo('No posee jefatura de curso');
      this.router.navigate(['/pages']);
    }

    this.subjects = await this.subjectService.getAll().toPromise();
    this.alumns = await this.alumnService.getAll().toPromise();
    this.filteredAlumns = this.alumns;
    this.selectedGrades = this.grades;
    this.dataSource.data = [];

    if (this.useBreadcrumb) {
      this.getInfoFromBreadCrumb();
    }
    this.ngxService.stopLoader('my');
  }

  enableSelectLists() {
    this.disableSelection = false;
  }

  compareFunction = (o1: any, o2: any) => o1.id === o2.id;
  async onSelectedGrade(evt: any) {
    try {
      this.filteredAlumns = [];
      this.disableSubjectSelect = false;
      if (evt.value) {
        const filteredsByGrade = this.alumns.filter((a) => a.gradeId === evt.value); // separa a los alumnos del curso seleccionado
        this.filteredAlumns.push(...filteredsByGrade);
        this.selectedGrade = this.grades.find((g) => g.id === evt.value);
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
      this.loadingCalifications = true;
      this.columnsToDisplay = this.displayedColumns.slice();

      if (evt.value) {
        this.selectedSubject = this.subjects.find((s) => s.id === evt.value);
        this.getCalificationInfo(this.selectedGrade.id, this.selectedSubject.id);
      }
      this.loadingCalifications = false;
    } catch (error) {
      this.loadingCalifications = false;
      this.toastService.showError(error.message || error);
    }
  }

  async getCalificationInfo(gradeId: number, subjectId: number) {
    this.loadingCalifications = true;
    this.califications = [];
    this.cummulativeCalifications = [];
    this.columnsToDisplay = this.displayedColumns.slice();
    this.cummulativeColumnsToDisplay = this.displayedColumns.slice();
    this.califications = await this.calificationService.getByGradeAndSubjectId(gradeId, subjectId).toPromise();
    this.cummulativeCalifications = await this.calificationService.getCummulativeByGradeAndSubjectId(gradeId, subjectId).toPromise();
    this.cummulativeCalifications = _.uniqBy(this.cummulativeCalifications, 'id');
    let maxvalue = Math.max(...this.califications.map(elt => elt.evaluationNumber));
    this.calificationNumber = maxvalue >= 0 ? maxvalue : 0;
    for (let i = 0; i < maxvalue; i++) {
      this.columnsToDisplay.push(`N${i + 1}`);
    }
    this.alumnCalifications.forEach(async (alumn) => {
      const foundedCalifications = this.califications.filter((c) => c.alumnId === alumn.alumnId);

      alumn.avg = 0;
      if (foundedCalifications.length) {
        for (let i = 1; i <= 15; i++) {
          const founded = foundedCalifications.find((calification) => Number(calification.evaluationNumber) === i);
          if (founded) {
            if (founded.isCummulative) {
              this.isCummulative[`N${i}Total`] = founded.isCummulative ? await this.getCummulativeCount(founded.calificationId, founded.alumnId) : 0;
            }
            alumn[`N${i}`] = founded.value;
            alumn[`N${i}Id`] = founded.id;
            alumn[`N${i}Cummulative`] = founded.isCummulative ? true : false;
            this.isCummulative[`N${i}`] = founded.isCummulative ? true : false;
          } else {
            alumn[`N${i}`] = null;
            alumn[`N${i}Id`] = null;
          }
        }
        alumn.avg = Number(this.getAvg(alumn));

      }
    });
    this.columnsToDisplay.push('avg');
    this.dataSource = new MatTableDataSource<AlumnCalifications>(this.alumnCalifications);
    this.loadingCalifications = false;
  }


  getAvg(evt: any) {
    let total = 0;
    let count = 0;
    for (let i = 1; i <= 15; i++) {
      if (evt[`N${i}`]) {
        total += evt[`N${i}`];
        count += 1;
      }
    }
    return total > 0 ? (total / count).toFixed(1) : 0;
  }
  openDialog(): void {
    let calificationsToSelect = _.uniqBy(this.califications, 'evaluationNumber');
    this.dialog.open(DialogMyGradeCalificationComponent, {
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
        if (!data.isCummulative) {
          this.editAlumnCalifications = true;
          this.getCalificationInfo(this.selectedGrade.id, this.selectedSubject.id);
        }
        else {
          const mainCalification = this.califications.find((c) => c.calificationId === data.calificationId);
          this.redirectingCalifications(Number(mainCalification.evaluationNumber), true);
        }
      }
    });
  }

  async updateCalifications() {
    try {
      if (this.validateForm()) {

        this.loadingCalifications = true;
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
        this.loadingCalifications = false;
        this.getCalificationInfo(this.selectedGrade.id, this.selectedSubject.id);
      }
      else {
        this.toastService.showWarning('Error en el valor de las notas');
      }
    } catch (error) {
      this.loadingCalifications = false;
    }
  }
  validateForm() {
    let isValidated = true;
    this.alumnCalifications.forEach((c) => {
      for (let i = 1; i <= 15; i++) {
        if (c[`N${i}`] && c[`N${i}`] > 7 || c[`N${i}`] && c[`N${i}`] < 2) {
          isValidated = false;
        }
      }

    });
    return isValidated;
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
    this.router.navigate(['pages/core/my-grade-cummulativeCalification'], navigationExtras);
  }

  async getCummulativeValue(calificationId: number, alumnId: number) {
    let values = this.cummulativeCalifications.filter((c) => c.alumnId === alumnId && c.calificationId === calificationId);
    let total = 0;
    values.forEach((v) => {
      total += v.value;
    });
    return total > 0 ? ((total) / (values.length)).toFixed(1) : 0;

  }
  async getCummulativeCount(calificationId: number, alumnId: number) {
    let values = this.cummulativeCalifications.filter((c) => c.alumnId === alumnId && c.calificationId === calificationId);
    return values ? values.length : 0;
  }
  async getInfoFromBreadCrumb() {
    this.loadingCalifications = true;
    const subject = {
      value: this.redirect.subjectId
    };
    const grade = {
      value: this.redirect.gradeId
    };
    this.loadingCalifications = false;
    this.onSelectedGrade(grade);
    this.onSelectedSubject(subject);
  }

  async generatePdf() {
    this.waitingDownload = true;
    this.reportData = await this.reportService.createReport(this.selectedGrade.gradeNumber).toPromise();
    this.generated = true;
    this.waitingDownload = false;
  }
  async downloadReport() {
    if (this.generated) {
      const reportToDownload = await this.reportService.downloadReport(this.reportData.id).toPromise();
      saveAs(reportToDownload, `Informes ${this.selectedGrade.name}`);
    }
  }
  changeDownloadStatus() {
    this.generated = false;
  }
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
