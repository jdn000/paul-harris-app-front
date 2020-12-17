import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Grade } from '../../../models/Grade';
import { LearningObjective } from '../../../models/learningObjective';
import { GradeService } from '../../../services/grade.service';
import { LearningObjectiveService } from '../../../services/learning-objective.service';
import { ToastService } from '../../../services/toast.service';
import { DialogLearningObjectiveComponent } from './dialog-learning-objective/dialog-learning-objective.component';
import _ from 'lodash';
import { SubjectService } from '../../../services/subject.service';
import { Subject } from '../../../models/subject';
@Component({
  selector: 'ngx-learning-objective',
  templateUrl: './learning-objective.component.html',
  styleUrls: ['./learning-objective.component.scss']
})
export class LearningObjectiveComponent implements OnInit, AfterViewInit {

  constructor(
    private readonly learningObjectiveService: LearningObjectiveService,
    private readonly toastService: ToastService,
    private readonly dialog: MatDialog,
    private readonly ngxService: NgxUiLoaderService,
    private readonly gradeService: GradeService,
    private readonly subjectService: SubjectService,
  ) { }
  loading = false;
  learningObjectives: LearningObjective[] = [];
  learningObjectiveData: LearningObjective = {} as LearningObjective;
  grades: Grade[] = [];
  selectedGrades: Grade[] = [];
  subjects: Subject[] = [];
  selectedSubjects: Subject[] = [];
  filteredLearningObjectives: LearningObjective[] = [];
  async ngOnInit() {
    this.ngxService.startLoader('obj');
    await this.load();
    this.ngxService.stopLoader('obj');
  }
  async load() {
    try {
      this.grades = await this.gradeService.getAll().toPromise();
      this.subjects = await this.subjectService.getAll().toPromise();
      this.learningObjectives = await this.learningObjectiveService.getAll().toPromise();
      this.filteredLearningObjectives = this.learningObjectives;
      this.selectedGrades = this.grades;
      this.selectedSubjects = this.subjects;
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }

  compareFunction = (o1: any, o2: any) => o1.id === o2.id;

  async onSelectedGrade(evt: any) {
    try {
      this.filteredLearningObjectives = [];
      for (const t of evt.value) {
        if (t) {
          const filteredsByGrade = this.learningObjectives.filter((a) => a.gradeId === t);
          this.filteredLearningObjectives.push(...filteredsByGrade);
        }
      }
      if (!evt.value.length) {

        this.filteredLearningObjectives = this.learningObjectives;
      }
      this.filteredLearningObjectives = _.uniqBy(this.filteredLearningObjectives, 'id');
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }
  async onSelectedSubject(evt: any) {
    try {

      for (const t of evt.value) {
        if (t) {
          const filteredsBySubject = this.filteredLearningObjectives.filter((a) => a.subjectId === t);
          this.filteredLearningObjectives = filteredsBySubject;
        }
      }
      if (!evt.value.length) {
        this.filteredLearningObjectives = this.learningObjectives;
      }
      this.filteredLearningObjectives = _.uniqBy(this.filteredLearningObjectives, 'id');
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }
  ngAfterViewInit(): void {
    this.smartTable.edit.subscribe((dataObject: any) => {
      this.learningObjectiveData = dataObject['data'];
      this.openDialog();
    });
    this.smartTable.create.subscribe((dataObject: any) => {
      this.learningObjectiveData = null;
      this.openDialog();
    });
  }
  openDialog(): void {
    this.dialog.open(DialogLearningObjectiveComponent, {
      data: {
        allObjectives: this.learningObjectives,
        objective: this.learningObjectiveData,
        title: this.learningObjectiveData ? 'Actualizar Objetivo de aprendizaje' : 'Nuevo Objetivo de aprendizaje',
        buttonTitle: this.learningObjectiveData ? 'ACTUALIZAR' : 'CREAR',
        grades: this.grades,
        subjects: this.subjects
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

      name: {
        title: 'Nombre',
        type: 'string',
      },
      description: {
        title: 'Descripción',
        type: 'string',
      },
      gradeId: {
        title: 'Curso',
        type: 'string',
        valuePrepareFunction: (cell, row) => {
          return (this.grades.find((g) => g.id === cell)).description;
        },
      },
      subjectId: {
        title: 'Asignatura',
        type: 'string',
        valuePrepareFunction: (cell, row) => {
          return (this.subjects.find((g) => g.id === cell)).description;
        },
      },
    },
  };

}
