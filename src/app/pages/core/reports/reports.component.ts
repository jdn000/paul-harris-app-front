import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Alumn } from '../../../models/alumn';
import { Grade } from '../../../models/grade';
import { AlumnService } from '../../../services/alumn.service';
import { GradeService } from '../../../services/grade.service';
import { ToastService } from '../../../services/toast.service';
import { DialogAlumnComponent } from '../alumn/dialog-alumn/dialog-alumn.component';
import _ from 'lodash';
import { saveAs } from 'file-saver';
import { ReportService } from '../../../services/report.service';
import { MatTableDataSource } from '@angular/material/table';
import { CalificationReport } from '../../../models/calification';
import { SemesterService } from '../../../services/semester.service';
@Component({
  selector: 'ngx-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  constructor(
    private readonly alumnService: AlumnService,
    private readonly toastService: ToastService,
    private readonly dialog: MatDialog,
    private readonly ngxService: NgxUiLoaderService,
    private readonly gradeService: GradeService,
    private readonly reportService: ReportService,
    private readonly semesterService: SemesterService

  ) { }
  loading = false;
  alumns: Alumn[] = [];
  alumnData: CalificationReport = {} as CalificationReport;
  grades: Grade[] = [];
  selectedGrades: Grade[] = [];
  filteredAlumns: Alumn[] = [];
  generated = false;
  selectedGrade: Grade = {} as Grade;
  reportData: any = {};
  selectedAlumnId: number;
  alumnFullName: string;
  isFirstSemester = false;
  waitingDownload = false;
  async ngOnInit() {
    this.ngxService.startLoader('re');
    await this.load();
    this.ngxService.stopLoader('re');
  }
  async load() {
    try {
      this.grades = await this.gradeService.getAll().toPromise();
      this.alumns = await this.alumnService.getAll().toPromise();
      this.isFirstSemester = await this.semesterService.isFirstSemester();

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

  async onSelectedAlumn(evt: any) {
    try {
      if (evt.value) {

        this.alumnData = await this.alumnService.getReportDataByAlumnId(evt.value).toPromise();
      }
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }
  async generatePdf() {
    this.waitingDownload = true;
    this.reportData = await this.reportService.createSingleReport(this.selectedAlumnId).toPromise();
    this.generated = true;
    this.waitingDownload = false;
  }
  sum(values: number[]) {
    let t = 0;
    let c = 0;
    values.forEach((v) => {
      t += v;
      c += 1;
    });
    return c > 0 ? t / c : 0;
    // return ((values.reduce((a, b) => a + b, 0)) / values.length);
  }

  getSemesterAvg() {
    let total = 0;
    this.alumnData.subjects.forEach((s) => {
      if (s.califications) {
        total += (this.sum(s.califications));
      }
    });
    return Number((total / (this.alumnData.subjects.length)).toFixed(1));
  }

  getFirstSemesterAvg() {
    let total = 0;
    let count = 0;
    this.alumnData.subjects.forEach((s) => {
      if (s.firstSemesterAvg) {
        total += s.firstSemesterAvg;
        count++;
      }
      count++;
    });
    return count > 0 ? Number((total / count).toFixed(1)) : 0;
  }

  getYearAvg() {
    const currentAvg = this.getSemesterAvg();
    const pastAvg = this.getFirstSemesterAvg();
    return Number(((pastAvg + currentAvg) / 2).toFixed(1));
  }

  async downloadReport() {
    if (this.generated) {
      const alumn = this.alumns.find((a) => a.id === this.selectedAlumnId);
      this.alumnFullName = `${alumn.names} ${alumn.lastName} ${alumn.secondSurname}`;
      const reportToDownload = await this.reportService.downloadReport(this.reportData.id).toPromise();
      saveAs(reportToDownload, `Informe ${this.alumnFullName}`);
    }
  }

  changeDownloadStatus() {
    this.generated = false;
  }

}
