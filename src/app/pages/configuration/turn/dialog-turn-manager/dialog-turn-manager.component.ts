import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TurnService } from '../../../../services/turn.service';
import { ToastService } from '../../../../services/toast.service';


@Component({
  selector: 'ngx-dialog-turn-manager',
  templateUrl: './dialog-turn-manager.component.html',
  styleUrls: ['./dialog-turn-manager.component.scss']
})
export class DialogTurnManagerComponent implements OnInit {

  title: string;
  buttonTitle: string;
  turnContentForm = {
    code: null,
    startHour: null,
    endHour: null,
    status: true,
  };

  constructor(
    public dialogRef: MatDialogRef<DialogTurnManagerComponent>,
    public dialog: MatDialog,
    public turnService: TurnService,
    private toastService: ToastService,

    @Inject(MAT_DIALOG_DATA) public getData: any,
  ) { }

  async ngOnInit() {
    this.title = this.getData['title'];
    this.buttonTitle = this.getData['buttonTitle'];
    if (this.getData['turn']) {

      this.turnContentForm.code = this.getData['turn'].code;
      this.turnContentForm.startHour = this.getData['turn'].startHour;
      this.turnContentForm.endHour = this.getData['turn'].endHour;
      this.turnContentForm.status = this.getData['turn'].status;
    }
  }

  async manageTurn() {
    if (this.validateForm()) {
      const dataTurn = Object.assign({});
      dataTurn.code = this.turnContentForm.code;
      if (this.turnContentForm.startHour.length === 8) {
        dataTurn.startHour = this.turnContentForm.startHour;
      } else {
        dataTurn.startHour = this.turnContentForm.startHour + ':00';
      }
      if (this.turnContentForm.endHour.length === 8) {
        dataTurn.endHour = this.turnContentForm.endHour;
      } else {
        dataTurn.endHour = this.turnContentForm.endHour + ':00';
      }
      dataTurn.status = this.turnContentForm.status ? true : false;
      dataTurn.userId = 1;

      try {
        if (this.getData['turn']) {
          delete dataTurn.userId;
          await this.turnService.update(this.getData['turn'].id, dataTurn).toPromise();
          this.toastService.showToast('success', 'Confirmación', 'Registro actualizado');
        } else {
          await this.turnService.add(dataTurn).toPromise();
          this.toastService.showToast('success', 'Confirmación', 'Registro creado exitósamente');
        }
        this.dialogRef.close(true);
      } catch (error) {
        this.toastService.showError(error.message || error);
      }
    }
  }

  validateForm() {
    if (this.getData['turn']) {
      if (!this.turnContentForm.code) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese un Código');
        return false;
      } else if (!this.turnContentForm.startHour) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese una hora inicial');
        return false;
      } else if (!this.turnContentForm.endHour) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese una hora final');
        return false;
      } else if (this.turnContentForm.startHour > this.turnContentForm.endHour) {
        this.toastService.showToast('warning', 'Error de validación', 'La hora inicial no puede ser menor a la hora final');
        return false;
      }
      return true;
    } else {
      if (!this.turnContentForm.code) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese un Código');
        return false;
      } else if (!this.turnContentForm.startHour) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese una hora inicial');
        return false;
      } else if (!this.turnContentForm.endHour) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese una hora final');
        return false;
      } else if (this.turnContentForm.startHour > this.turnContentForm.endHour) {
        this.toastService.showToast('warning', 'Error de validación', 'La hora inicial no puede ser menor a la hora final');
        return false;
      } else {
        let turnCode;
        turnCode = this.getData['allTurn'].find((dem) => dem.code === this.turnContentForm.code);
        if (turnCode) {
          this.toastService.showToast(
            'warning',
            'Error de validación',
            'El Código "' + this.turnContentForm.code + '" ya se encuentra registrado!'
          );
          return false;
        }
        return true;
      }
    }
  }

}
