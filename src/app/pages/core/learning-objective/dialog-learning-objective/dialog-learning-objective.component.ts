import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
import { Grade } from '../../../../models/Grade';
import { Indicator } from '../../../../models/indicator';
import { LearningObjective } from '../../../../models/learningObjective';
import { Subject } from '../../../../models/subject';
import { IndicatorService } from '../../../../services/indicator.service';
import { LearningObjectiveService } from '../../../../services/learning-objective.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'ngx-dialog-learning-objective',
  templateUrl: './dialog-learning-objective.component.html',
  styleUrls: ['./dialog-learning-objective.component.scss']
})
export class DialogLearningObjectiveComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<DialogLearningObjectiveComponent>,
    public dialog: MatDialog,
    private readonly learningObjectiveService: LearningObjectiveService,
    private readonly toastService: ToastService,
    private readonly indicatorService: IndicatorService,
    @Inject(MAT_DIALOG_DATA) public getData: {
      allObjectives: LearningObjective[],
      objective: LearningObjective,
      title: string;
      buttonTitle: string;
      grades: Grade[];
      subjects: Subject[];
    }) {
    this.indicatorsSource = new LocalDataSource(this.indicators);
  }
  title: string;
  buttonTitle: string;
  isNewObjective: boolean;
  objectiveContentForm: LearningObjective = {} as LearningObjective;
  indicators: Indicator[] = [];
  unsavedIndicators: Indicator[] = [];
  loading = false;
  async ngOnInit() {
    this.loading = true;
    this.title = this.getData.title;
    this.buttonTitle = this.getData.buttonTitle;
    if (this.getData.objective) {
      this.objectiveContentForm = this.getData.objective;
      this.indicators = (await this.indicatorService.getByObjectiveId(this.getData.objective.id).toPromise()).filter((i) => i.status === true);
      this.indicatorsSource.load(this.indicators);
      this.isNewObjective = false;
    } else {
      this.isNewObjective = true;
    }
    this.loading = false;
  }

  async manageObjective() {
    if (this.validateForm()) {
      try {
        const objectInfo = Object.assign({}, this.objectiveContentForm);
        if (this.isNewObjective) {
          const res = await this.learningObjectiveService.add(objectInfo).toPromise();

          if (res) {
            if (this.unsavedIndicators) {
              this.indicators = await Promise.all(this.unsavedIndicators.map((i) => {
                i.objectiveId = res.id;
                return this.indicatorService.add(i).toPromise();
              }));
            }
            this.toastService.showToast('success', 'Confirmación', 'Registro creado exitosamente');
          } else {
            this.toastService.showWarning('Error actualizando objetivo de aprendizaje');
          }
        } else {
          const id = this.getData.objective.id;
          const objectInfo = Object.assign({}, this.objectiveContentForm);
          delete objectInfo.id;
          const res = await this.learningObjectiveService.update(id, objectInfo).toPromise();
          if (res) {
            this.toastService.showToast('success', 'Confirmación', 'Registro actualizado');
          } else {
            this.toastService.showWarning('Error actualizando objetivo de aprendizaje');
          }
        }
        this.dialogRef.close(objectInfo);
      } catch (error) {
        this.toastService.showError(error.message || error);
      }
    }
  }
  async onCreateConfirm(event) {
    if (this.validateSmartTable(event)) {

      const newIndicator: Indicator = {} as Indicator;
      newIndicator.name = event.newData.name;
      newIndicator.description = event.newData.description;
      newIndicator.objectiveId = this.objectiveContentForm.id;
      try {
        if (this.isNewObjective) {
          this.unsavedIndicators.push(newIndicator);
        } else {
          await this.indicatorService.add(newIndicator).toPromise();
          this.indicatorsSource.load(this.indicators);
        }
      } catch (error) {
        this.toastService.showError(error.message || error);
      }
      event.confirm.resolve();

    }
  }


  async onSaveConfirm(event) {
    if (this.validateSmartTable(event)) {
      const newIndicator: Indicator = {} as Indicator;
      newIndicator.name = event.newData.name;
      newIndicator.description = event.newData.description;
      newIndicator.objectiveId = this.objectiveContentForm.id;
      try {
        await this.indicatorService.update(event.newData.id, newIndicator).toPromise();
        this.indicatorsSource.load(this.indicators);
      } catch (error) {
        this.toastService.showError(error.message || error);
      }
      event.confirm.resolve();

    }
  }

  validateSmartTable(event: any) {

    if (!event.newData.name) {
      this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese  Nombre');
      return false;
    } else if (!event.newData.description) {
      this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese  Descripción');
      return false;
    }
    return true;
  }
  validateForm() {
    if (!this.objectiveContentForm.subjectId) {
      this.toastService.showToast('warning', 'Dato Incompleto', 'Seleccione asignatura');
      return false;
    } else if (!this.objectiveContentForm.name) {
      this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese  Nombre');
      return false;
    } else if (!this.objectiveContentForm.description) {
      this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese  Descripción');
      return false;
    } else if (!this.objectiveContentForm.gradeId) {
      this.toastService.showToast('warning', 'Dato Incompleto', 'Seleccione un Curso');
      return false;
    }
    return true;
  }
  @ViewChild('indicators') smartTable: Ng2SmartTableComponent;
  indicatorsSource: LocalDataSource;
  settings = {
    actions: {
      position: 'right',
      columnTitle: 'Acción',
      delete: false
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmDelete: true,
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    columns: {
      name: {
        title: 'Nombre',
        type: 'string',
        filter: false
      },
      description: {
        title: 'Descripción',
        type: 'string',
        filter: false
      },
    },
  };
}


