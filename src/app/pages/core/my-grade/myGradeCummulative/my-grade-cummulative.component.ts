import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from '../../../../models/subject';
import { Calification } from '../../../../models/calification';
import { Grade } from '../../../../models/Grade';
import { AlumnService } from '../../../../services/alumn.service';
import { CalificationService } from '../../../../services/calification.service';
import { GradeService } from '../../../../services/grade.service';
import { SubjectService } from '../../../../services/subject.service';
import { ToastService } from '../../../../services/toast.service';
import { NavigationExtras, Router } from '@angular/router';
import { Alumn } from '../../../../models/alumn';
import _ from 'lodash';
@Component({
  selector: 'ngx-my-grade-cummulative',
  templateUrl: './my-grade-cummulative.component.html',
  styleUrls: ['./my-grade-cummulative.component.scss']
})
export class MyGradeCummulativeComponent implements OnInit {

  constructor(private readonly calificationService: CalificationService,
    private readonly toastService: ToastService,

    private readonly router: Router,

    private readonly alumnService: AlumnService,


  ) {
    if (typeof this.router.getCurrentNavigation().extras.state !== 'undefined') {
      this.redirect.gradeId = this.router.getCurrentNavigation().extras.state.gradeId;
      this.redirect.subjectId = this.router.getCurrentNavigation().extras.state.subjectId;
      this.redirect.calificationNumber = this.router.getCurrentNavigation().extras.state.calificationNumber;
      this.useBreadcrumb = true;
      this.editAlumnCalifications = this.router.getCurrentNavigation().extras.state.editAlumnCalifications;
    }

  }
  showCummulativeTable = false;
  disableSubjectSelect = true;
  alumnCalifications: AlumnCalifications[] = [];
  califications: Calification[] = [];
  calificationId: number;
  displayedColumns: string[] = ['alumnFullName'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  alumns: Alumn[] = [];
  calificationNumber: number;

  dataSource = new MatTableDataSource<AlumnCalifications>([]);
  redirect = {
    calificationNumber: null,
    gradeId: null,
    subjectId: null
  };
  editAlumnCalifications = false;
  useBreadcrumb = false;

  async ngOnInit() {
    this.columnsToDisplay = this.displayedColumns.slice();
    this.alumns = await this.alumnService.getAll().toPromise();
    this.alumns = this.alumns.filter((a) => a.gradeId === this.redirect.gradeId);
    this.alumnCalifications = this.alumns.map((alumn) => {
      return {
        alumnFullName: `${alumn.lastName} ${alumn.secondSurname} ${alumn.names} `,
        alumnId: alumn.id
      };
    });

    if (this.redirect.calificationNumber) {
      this.getCummulativeCalifications(this.redirect.calificationNumber);
      this.dataSource = new MatTableDataSource<AlumnCalifications>(this.alumnCalifications);
    }
    if (!this.redirect.calificationNumber) {
      this.redirectingCalifications();
    }
  }

  editCalifications() {
    this.editAlumnCalifications = !this.editAlumnCalifications;
  }

  async getCummulativeCalifications(gradeId: number) {
    this.showCummulativeTable = true;
    this.califications = await this.calificationService.getCummulativeByCalificationId(gradeId).toPromise();

    let maxvalue = Math.max(...this.califications.map(elt => elt.evaluationNumber));

    this.calificationNumber = maxvalue >= 0 ? maxvalue : 1;
    for (let i = 0; i < maxvalue; i++) {
      this.columnsToDisplay.push(`A${i + 1}`);
    }
    this.alumnCalifications.forEach((alumn) => {
      const foundedCalifications = this.califications.filter((c) => c.alumnId === alumn.alumnId);
      let count = 0;
      let total = 0;
      alumn.avg = 0;
      if (foundedCalifications.length) {
        for (let i = 1; i <= 15; i++) {
          const founded = foundedCalifications.find((calification) => Number(calification.evaluationNumber) === i);
          if (founded) {
            alumn.calificationId = founded.mainCalificationId;
            alumn[`A${i}`] = founded.value;
            alumn[`A${i}Id`] = founded.id;
            total += founded.value;
            count += 1;
          } else {
            alumn[`A${i}`] = null;
            alumn[`A${i}Id`] = null;
          }
        }
        alumn.avg = count > 0 ? Math.round(total / count) : 0;
      }
    });

    this.columnsToDisplay.push('avg');
  }

  redirectingCalifications() {
    const navigationExtras: NavigationExtras = {
      state: {
        calificationNumber: this.redirect.calificationNumber,
        gradeId: this.redirect.gradeId,
        subjectId: this.redirect.subjectId
      }
    };
    this.router.navigate(['pages/core/my-grade'], navigationExtras);
  }

  async updateCalifications() {
    try {
      if (this.validateForm()) {
        let calificationsToUpdate = [];
        let mainCalificationToUpdate = [];
        this.alumnCalifications.forEach((c) => {
          for (let i = 1; i <= 15; i++) {
            if (c[`A${i}`]) {
              mainCalificationToUpdate.push({
                id: c.calificationId,
                value: Math.round(c.avg)
              });
              calificationsToUpdate.push({
                id: c[`A${i}Id`],
                value: c[`A${i}`]
              });
            }
          }
        }
        );
        if (!calificationsToUpdate.length) {
          this.toastService.showError('no se pudo actualizar');
        } else {
          mainCalificationToUpdate = _.uniqBy(mainCalificationToUpdate, 'id');
          const updated = await this.calificationService.updateCummulatives(calificationsToUpdate).toPromise();
          const mainCalificationUpdated = await this.calificationService.update(mainCalificationToUpdate).toPromise();
          updated && mainCalificationUpdated ? this.toastService.showSuccess('actualizadas') : this.toastService.showError('no se pudo actualizar');
          this.redirectingCalifications();
        }
      } else {
        this.toastService.showWarning('Error en el valor de las notas');
      }

    } catch (error) {
      this.toastService.showError('no se pudo actualizar');
    }
  }
  validateForm() {
    let isValidated = true;
    this.alumnCalifications.forEach((c) => {
      for (let i = 1; i <= 15; i++) {
        if (c[`A${i}`] && c[`A${i}`] > 7 || c[`A${i}`] && c[`A${i}`] < 2) {
          isValidated = false;
        }
      }
    });
    return isValidated;
  }

}
export interface AlumnCalifications {
  alumnFullName: string;
  alumnId: number;
  calificationId?: number;
  A1?: number;
  A1Id?: number;
  A2?: number;
  A2Id?: number;
  A3?: number;
  A3Id?: number;
  A4?: number;
  A4Id?: number;
  A5?: number;
  A5Id?: number;
  A6?: number;
  A6Id?: number;
  A7?: number;
  A7Id?: number;
  A8?: number;
  A8Id?: number;
  A9?: number;
  A9Id?: number;
  A10?: number;
  A10Id?: number;
  avg?: number;
}

