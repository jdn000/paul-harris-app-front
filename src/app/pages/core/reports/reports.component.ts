import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Alumn } from '../../../models/alumn';
import { Grade } from '../../../models/Grade';
import { AlumnService } from '../../../services/alumn.service';
import { GradeService } from '../../../services/grade.service';
import { ToastService } from '../../../services/toast.service';
import { DialogAlumnComponent } from '../alumn/dialog-alumn/dialog-alumn.component';
import _ from 'lodash';
import { saveAs } from 'file-saver';
import { ReportService } from '../../../services/report.service';
import { MatTableDataSource } from '@angular/material/table';
import { CalificationReport } from '../../../models/calification';
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
    private readonly reportService: ReportService

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
    this.reportData = await this.reportService.createSingleReport(this.selectedAlumnId).toPromise();
    this.generated = true;
  }
  sum(values: number[]) {
    return Math.round((values.reduce((a, b) => a + b, 0) / values.length));
  }

  getSemesterAvg() {
    let total = 0;
    this.alumnData.subjects.forEach((s) => {
      total += this.sum(s.califications);
    });
    return Math.round(total / (this.alumnData.subjects.length));
  }
  getYearAvg() {

    let pastTotal = 0;
    this.alumnData.subjects.forEach((s) => {
      pastTotal += s.firstSemesterAvg;
    });
    const currentAvg = this.getSemesterAvg();
    return Math.round((pastTotal + currentAvg) / 2);

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
