import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Alumn } from '../../../../models/alumn';
import { BatchCalifications, Calification, CalificationIndicator } from '../../../../models/calification';
import { Grade } from '../../../../models/grade';
import { Indicator } from '../../../../models/indicator';
import { LearningObjective } from '../../../../models/learningObjective';
import { AlumnService } from '../../../../services/alumn.service';
import { IndicatorService } from '../../../../services/indicator.service';
import { LearningObjectiveService } from '../../../../services/learning-objective.service';
import { ToastService } from '../../../../services/toast.service';
import _ from 'lodash';
import { MatSelectionListChange } from '@angular/material/list';
import { CalificationService } from '../../../../services/calification.service';

@Component({
  selector: 'ngx-dialog-calification',
  templateUrl: './dialog-calification.component.html',
  styleUrls: ['./dialog-calification.component.scss']
})
export class DialogCalificationComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogCalificationComponent>,
    public alumnService: AlumnService,
    public learningObjectiveService: LearningObjectiveService,
    public readonly indicatorService: IndicatorService,
    private toastService: ToastService,
    private readonly calificationService: CalificationService,

    @Inject(MAT_DIALOG_DATA) public getData: {
      allAlumns: Alumn[],
      title: string;
      buttonTitle: string;
      grade: Grade;
      subjectId: number;
      calificationNumber: number;
      calificationsToSelect: Calification[];
    }) { }
  title: string;
  buttonTitle: string;
  selectedGrade: Grade;
  selectedSubjectId: number;
  objectives: LearningObjective[] = [];
  objectivesFiltered: LearningObjective[] = [];
  indicators: Indicator[] = [];
  calificationIndicator: CalificationIndicator = {} as CalificationIndicator;
  calificationIndicators: CalificationIndicator[] = [];
  calificationNumber: number;
  filteredIndicators: Indicator[] = [];
  alumns: Alumn[];
  calificationsToSelect: Calification[] = [];
  calificationsSelected: Calification[];
  isCummulative = false;
  form = {
    objectiveId: null,
    indicators: [],
    gradeId: null,
    subjectId: null,
    isCummulative: false,
    evaluationNumber: null,
    calificationId: null
  };
  async ngOnInit() {
    this.title = this.getData.title;
    this.buttonTitle = this.getData.buttonTitle;
    this.selectedGrade = this.getData.grade;
    this.selectedSubjectId = this.getData.subjectId;
    this.calificationNumber = this.getData.calificationNumber;
    this.calificationsToSelect = this.getData.calificationsToSelect;
    this.calificationsSelected = [];
    if (this.calificationNumber >= 15) {
      this.detectMaxReached();
    } else {
      this.objectives = await this.learningObjectiveService.getGradeAndSubjectId(this.selectedGrade.id, this.selectedSubjectId).toPromise();
      this.objectives = _.uniqBy(this.objectives, 'id');
      this.objectivesFiltered = await this.objectives.filter((i) => i.hasCalifications === true);
      this.alumns = this.getData.allAlumns;
      this.form.evaluationNumber = this.calificationNumber;
      this.calificationIndicators = await Promise.all(this.objectives.map(async (objective) => {
        let indicators = await this.indicatorService.getByObjectiveId(objective.id).toPromise();
        return {
          calificationId: objective.id,
          indicatorsIds: indicators.map((i) => { return i.id; })
        };
      }));
    }
  }
  async detectMaxReached() {
    this.toastService.showInfo('Límite de notas alcanzado');
    this.dialogRef.close();
  }
  async onSelectedObjective(evt: any) {
    try {
      this.filteredIndicators = [];
      this.calificationsSelected = [];
      if (evt.value) {
        this.filteredIndicators = await this.indicatorService.getByObjectiveId(evt.value).toPromise();
      } else {
        this.filteredIndicators = [];
      }
      this.filteredIndicators = _.uniqBy(this.filteredIndicators, 'id');

      this.calificationsSelected = this.calificationsToSelect.filter((c) => c.objectiveId === evt.value);

    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }

  async onSelectedIndicators(evt: any) {
    try {
      this.form.indicators = evt.value;
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }
  async onChange(change: MatSelectionListChange) {
    if (change.option.selected === false) {
      this.form.indicators = [];
    }
  }


  async manageCalifications() {

    const mainCalification = {
      subjectId: this.selectedSubjectId,
      isCummulative: this.isCummulative,
      objectiveId: this.isCummulative ? null : this.form.objectiveId,
      evaluationNumber: this.isCummulative ? await this.getHigestEvaluationNumber(this.form.calificationId) : this.form.evaluationNumber,
      gradeId: this.selectedGrade.id,

    };

    let calificationsToSave = this.alumns.map((alumn) => {
      return {
        alumnId: alumn.id,
        value: 2
      };
    });
    let batchCalifToSave: BatchCalifications = {
      califications: calificationsToSave,
      mainCalification: mainCalification,
      indicators: this.form.indicators
    };
    let a: any;

    if (!this.isCummulative) {
      a = await this.calificationService.add(batchCalifToSave).toPromise();
    } else {
      batchCalifToSave.mainCalification.id = this.form.calificationId;

      a = await this.calificationService.addCummulatives(batchCalifToSave).toPromise();
    }
    if (a) {
      this.toastService.showSuccess('Ingresado correctamente');
    } else {
      this.toastService.showError('No se pudo ingresar');
    }
    a.isCummulative = this.isCummulative;
    a.evaluationNumber = this.calificationNumber - 1;
    a.calificationId = this.form.calificationId;

    this.dialogRef.close(a);
  }
  async getHigestEvaluationNumber(calificationId: number) {
    const cummulativeCalifications = await this.calificationService.getCummulativeByCalificationId(calificationId).toPromise();
    let maxvalue = Math.max(...cummulativeCalifications.map(elt => elt.evaluationNumber));
    return maxvalue >= 0 ? maxvalue + 1 : 1;

  }
}
