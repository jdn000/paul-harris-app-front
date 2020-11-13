import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TubeService } from '../../../../services/tube.service';
import { ToastService } from '../../../../services/toast.service';


@Component({
  selector: 'ngx-dialog-tube-manager',
  templateUrl: './dialog-tube-manager.component.html',
  styleUrls: ['./dialog-tube-manager.component.scss']
})
export class DialogTubeManagerComponent implements OnInit {

  title: string;
  buttonTitle: string;
  tubeContentForm = {
    code: null,
    description: null,
    abbreviation: null,
    borderColor: null,
    capColor: null,
    status: true,
  };

  constructor(
    public dialogRef: MatDialogRef<DialogTubeManagerComponent>,
    public dialog: MatDialog,
    public tubeService: TubeService,
    private toastService: ToastService,

    @Inject(MAT_DIALOG_DATA) public getData: any,
  ) { }

  async ngOnInit() {
    this.title = this.getData['title'];
    this.buttonTitle = this.getData['buttonTitle'];
    if (this.getData['tube']) {
      this.tubeContentForm.code = this.getData['tube'].code;
      this.tubeContentForm.description = this.getData['tube'].description;
      this.tubeContentForm.abbreviation = this.getData['tube'].abbreviation;
      this.tubeContentForm.borderColor = this.getData['tube'].borderColor;
      this.tubeContentForm.capColor = this.getData['tube'].capColor;
      this.tubeContentForm.status = this.getData['tube'].status;
    }
  }

  async manageTube() {
    if (this.validateForm()) {
      // form
      const dataTube = Object.assign({});
      dataTube.code = this.tubeContentForm.code;
      dataTube.description = this.tubeContentForm.description;
      dataTube.abbreviation = this.tubeContentForm.abbreviation;
      dataTube.borderColor = this.tubeContentForm.borderColor;
      dataTube.capColor = this.tubeContentForm.capColor;
      dataTube.status = this.tubeContentForm.status ? true : false;
      dataTube.userId = 1;
      dataTube.specimenId = 1;
      try {
        if (this.getData['tube']) {
          delete dataTube.userId;
          delete dataTube.specimenId;
          await this.tubeService.update(this.getData['tube'].id, dataTube).toPromise();
          this.toastService.showToast('success', 'Info', 'Registro actualizado exitósamente');
        } else {
          await this.tubeService.add(dataTube).toPromise();
          this.toastService.showToast('success', 'Info', 'Registro creado exitósamente');
        }
        this.dialogRef.close(true);
      } catch (error) {
        this.toastService.showError(error.message || error);
      }
    }
  }

  validateForm() {
    if (this.getData['tube']) {
      if (!this.tubeContentForm.code) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese un Código');
        return false;
      } else if (!this.tubeContentForm.description) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese una Descripción');
        return false;
      } else if (!this.tubeContentForm.abbreviation) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese una Abreviación');
        return false;
      } else if (!this.tubeContentForm.borderColor) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese un color al Borde');
        return false;
      } else if (!this.tubeContentForm.capColor) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese un color a la Tapa');
        return false;
      }
      return true;
    } else {
      if (!this.tubeContentForm.code) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese un Código');
        return false;
      } else if (!this.tubeContentForm.description) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese una Descripción');
        return false;
      } else if (!this.tubeContentForm.abbreviation) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese una Abreviación');
        return false;
      } else {
        let tubeCode;
        tubeCode = this.getData['allTubes'].find((dem) => dem.code === this.tubeContentForm.code);
        if (tubeCode) {
          this.toastService.showToast(
            'warning',
            'Info',
            'El Código "' + this.tubeContentForm.code + '" ya se encuentra registrado!'
          );
          return false;
        }
        return true;
      }
    }
  }

}
