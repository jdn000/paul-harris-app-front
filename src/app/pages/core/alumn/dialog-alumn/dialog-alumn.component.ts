import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Alumn } from '../../../../models/alumn';
import { ToastService } from '../../../../services/toast.service';
import { AlumnService } from '../../../../services/alumn.service';
import { Grade } from '../../../../models/grade';

@Component({
  selector: 'ngx-dialog-alumn',
  templateUrl: './dialog-alumn.component.html',
  styleUrls: ['./dialog-alumn.component.scss']
})
export class DialogAlumnComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogAlumnComponent>,
    public dialog: MatDialog,
    public alumnService: AlumnService,
    private toastService: ToastService,

    @Inject(MAT_DIALOG_DATA) public getData: {
      allAlumns: Alumn[],
      alumn: Alumn,
      title: string;
      buttonTitle: string;
      grades: Grade[];
    },) { }
  title: string;
  buttonTitle: string;
  isNewAlumn: boolean;
  alumnContentForm: Alumn = {} as Alumn;
  loading = false;
  async ngOnInit() {
    this.loading = true;
    this.title = this.getData.title;
    this.buttonTitle = this.getData.buttonTitle;
    if (this.getData.alumn) {
      this.alumnContentForm = this.getData.alumn;
      this.isNewAlumn = false;
    } else {
      this.isNewAlumn = true;
    }
    this.loading = false;
  }
  async manageAlumn() {
    if (this.validateForm()) {
      try {
        const alumnInfo = Object.assign({}, this.alumnContentForm);
        if (this.isNewAlumn) {
          const res = await this.alumnService.add(alumnInfo).toPromise();
          if (res) {
            this.toastService.showToast('success', 'Confirmación', 'Registro creado exitosamente');
          } else {
            this.toastService.showWarning('Error actualizando alumno');
          }
        } else {
          const id = this.getData.alumn.id;
          const alumnInfo = Object.assign({}, this.alumnContentForm);
          delete alumnInfo.id;
          const res = await this.alumnService.update(id, alumnInfo).toPromise();
          if (res) {
            this.toastService.showToast('success', 'Confirmación', 'Registro actualizado');
          } else {
            this.toastService.showWarning('Error actualizando alumno');
          }
        }
        this.dialogRef.close(alumnInfo);
      } catch (error) {
        this.toastService.showError(error.message || error);
      }
    }
  }

  validateForm() {
    if (!this.alumnContentForm.names) {
      this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese  Nombres');
      return false;
    } else if (!this.alumnContentForm.lastName) {
      this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese  Apellido Paterno');
      return false;
    } else if (!this.alumnContentForm.secondSurname) {
      this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese Apellido Materno');
      return false;
    } else if (!this.alumnContentForm.gradeId && this.isNewAlumn) {
      this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese un Curso');
      return false;
    }
    return true;
  }
}
