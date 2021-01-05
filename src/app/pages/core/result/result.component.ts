import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { Grade } from '../../../models/grade';
import { LearningObjective, ObjectiveData } from '../../../models/learningObjective';
import { Subject } from '../../../models/subject';
import { AlumnService } from '../../../services/alumn.service';
import { CalificationService } from '../../../services/calification.service';
import { GradeService } from '../../../services/grade.service';
import { LearningObjectiveService } from '../../../services/learning-objective.service';
import { ReportService } from '../../../services/report.service';
import { SubjectService } from '../../../services/subject.service';
import { ToastService } from '../../../services/toast.service';
import _ from 'lodash';
import { AlumnCalification } from '../../../models/calification';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { UserSubject } from '../../../models/user';
import { UserSubjectService } from '../../../services/userSubject.service';
@Component({
  selector: 'ngx-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  objectives: LearningObjective[] = [];

  objectiveData: ObjectiveData[] = [];

  learningObjectives: LearningObjective[] = [];
  rawObjectives: LearningObjective[] = [];
  grades: Grade[] = [];
  selectedGrades: Grade[] = [];
  selectedGradeId: number;
  selectedSubjectId: number;
  subjects: Subject[] = [];
  selectedSubjects: Subject[] = [];
  locked = false;
  low: AlumnCalification[] = [];
  high: AlumnCalification[] = [];
  medium: AlumnCalification[] = [];
  filteredLearningObjectives: LearningObjective[] = [];
  tempFilteredLearningObjectives: LearningObjective[] = [];
  multi: any[];
  multi2: any[];
  multi3: any[];
  view: any[] = [800, 450];
  view2: any[] = [600, 350];
  userSubjects: UserSubject[] = [];
  rawSubjects: Subject[] = [];
  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  legendTitle: string = 'Simbología';
  showXAxisLabel: boolean = true;
  yAxisLabel: string = '% de alumnos';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Objetivo';
  xAxisLabel2: string = 'Indicador';

  colorScheme = {
    domain: ['#2e31fce8', '#019afff8', '#54C6EB', '#000000']
  };
  data = false;
  data2 = false;

  constructor(
    private readonly calificationService: CalificationService,
    private readonly objectiveService: LearningObjectiveService,
    private readonly toastService: ToastService,
    private readonly ngxService: NgxUiLoaderService,
    private readonly gradeService: GradeService,
    private readonly subjectService: SubjectService,
    private readonly userSubjectService: UserSubjectService,
    private readonly reportService: ReportService) { }

  async ngOnInit() {
    this.ngxService.startLoader('obj');
    await this.load();
    //   this.multi = multi;
    this.ngxService.stopLoader('obj');
    this.objectives = await this.objectiveService.getAll().toPromise();
  }
  async load() {
    try {
      this.locked = true;
      await this.filterSubjects();
      this.grades = await this.gradeService.getAll().toPromise();
      await this.filterObjectives();
      this.filteredLearningObjectives = this.learningObjectives;
      this.selectedGrades = this.grades;
      this.selectedSubjects = this.subjects;
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }
  compareFunction = (o1: any, o2: any) => o1.id === o2.id;

  async filterSubjects() {
    this.rawSubjects = await this.subjectService.getAll().toPromise();
    this.userSubjects = await this.userSubjectService.getByUserId(Number(localStorage.getItem('userId'))).toPromise();
    this.userSubjects.forEach((u) => {
      const allowedSubject = this.rawSubjects.find((rs) => rs.id === u.subjectId);
      if (allowedSubject) {
        this.subjects.push(allowedSubject);
      }
    });
  }
  async filterObjectives() {
    this.rawObjectives = await this.objectiveService.getAll().toPromise();
    this.subjects.forEach((u) => {
      const allowedObjectives = this.rawObjectives.find((rs) => rs.subjectId === u.id);
      if (allowedObjectives) {
        this.learningObjectives.push(allowedObjectives);
      }
    });
  }
  async onSelectedGrade(evt: any) {
    try {
      this.filteredLearningObjectives = [];
      if (evt.value) {
        const filteredsByGrade = this.learningObjectives.filter((a) => a.gradeId === evt.value);
        this.filteredLearningObjectives.push(...filteredsByGrade);
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
      let temp = [];
      if (evt.value) {
        const filteredsBySubject = this.filteredLearningObjectives.filter((a) => a.subjectId === evt.value);
        temp.push(...filteredsBySubject);
      }
      this.tempFilteredLearningObjectives = _.uniqBy(temp, 'id');
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }

  async onSelectedGeneralGrade(evt: any) {
    try {

      this.filteredLearningObjectives = [];
      if (evt.value) {
        const filteredsByGrade = this.learningObjectives.filter((a) => a.gradeId === evt.value);
        this.filteredLearningObjectives.push(...filteredsByGrade);
      }
      this.filteredLearningObjectives = _.uniqBy(this.filteredLearningObjectives, 'id');
      if (this.selectedSubjectId) {
        this.onSelectedGeneralSubject({ value: this.selectedSubjectId });
      }
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }

  async onSelectedGeneralSubject(evt: any) {
    try {
      let graphGral = [];
      let tempObj = [];
      this.multi3 = [];
      if (evt.value) {
        const filteredsBySubject = this.filteredLearningObjectives.filter((a) => a.subjectId === evt.value);
        tempObj = filteredsBySubject;
      }
      tempObj = _.uniqBy(tempObj, 'id');
      graphGral = await Promise.all(tempObj.map(async (o) => {
        let data = await this.getDataFromObjectiveId(o.id);
        return this.putDataOnObject(data.low.length, data.medium.length, data.high.length, o.description);
      }));
      this.multi3 = graphGral;
      this.data = true;
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }

  async getDataFromObjectiveId(objectiveId: number) {
    this.objectiveData = await this.objectiveService.getAllDataById(objectiveId).toPromise();

    let l = [];
    let m = [];
    let h = [];
    this.objectiveData.forEach((o) => {
      o.califications.forEach((c) => {
        if (c.value < 3.9) {
          l.push(c);// por objetivo
        }
        if (c.value >= 4 && c.value <= 5.9) {
          m.push(c);// por objetivo
        }
        if (c.value >= 6) {// por objetivo
          h.push(c);
        }
      });
    });
    return {
      low: l,
      medium: m,
      high: h
    };
  }

  async onSelectedObjective(evt: any) {
    try {
      this.objectiveData = [];
      this.low = [];
      this.medium = [];
      this.high = [];
      let graph = [];
      let indicatorGraph = [];
      let description = (this.filteredLearningObjectives.find((o) => o.id === evt.value)).description;
      if (evt.value) {
        this.objectiveData = await this.objectiveService.getAllDataById(evt.value).toPromise();
        this.objectiveData.forEach((o) => {
          let l = [];
          let m = [];
          let h = [];
          o.califications.forEach((c) => {
            if (c.value < 3.9) {
              this.low.push(c);// por objetivo
              l.push(c);
            }
            if (c.value >= 4 && c.value <= 5.9) {
              this.medium.push(c);// por objetivo
              m.push(c);
            }
            if (c.value >= 6) {// por objetivo
              this.high.push(c);
              h.push(c);
            }
            indicatorGraph.push(this.putDataOnObject(l.length, m.length, h.length, o.description));
          });
        });
        graph.push(this.putDataOnObject(this.low.length, this.medium.length, this.high.length, description));
        this.multi = graph;
        this.multi2 = indicatorGraph;
        this.data2 = true;
      }

    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }


  putDataOnObject(low: number, medium: number, high: number, description: string) {
    return {
      'name': description,
      "series": [
        {
          "name": " Logrado",
          "value": high
        },
        {
          "name": "Medianamente Logrado",
          "value": medium
        }, {
          "name": "No Logrado",
          "value": low
        },]
    };
  }
}
export var multi = [
  {
    "name": "Germany",
    "series": [
      {
        "name": "2010",
        "value": 73000000
      },
      {
        "name": "2011",
        "value": 89400000
      },
      {
        "name": "1990",
        "value": 62000000
      },
      {
        "name": "1990",
        "value": 62000000
      }
    ]
  },

  {
    "name": "USA",
    "serie": [
      {
        "name": "2010",
        "value": 309000000
      },
      {
        "name": "2011",
        "value": 311000000
      },
      {
        "name": "1990",
        "value": 250000000
      }
    ]
  },

  {
    "name": "France",
    "series": [
      {
        "name": "2010",
        "value": 50000020
      },
      {
        "name": "2011",
        "value": 58000000
      },
      {
        "name": "1990",
        "value": 58000000
      }
    ]
  },
  {
    "name": "UK",
    "series": [
      {
        "name": "2010",
        "value": 62000000
      },
      {
        "name": "1990",
        "value": 57000000
      }
    ]
  }
];

