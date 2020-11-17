import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastService } from '../../../../services/toast.service';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user';


@Component({
  selector: 'ngx-dialog-user-manager',
  templateUrl: './dialog-user-manager.component.html',
  styleUrls: ['./dialog-user-manager.component.scss']
})
export class DialogUserManagerComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogUserManagerComponent>,
    public dialog: MatDialog,
    public userService: UserService,
    private toastService: ToastService,

    @Inject(MAT_DIALOG_DATA) public getData: any,
  ) { }

  title: string;
  buttonTitle: string;
  passwordRepeat: string;
  isNewUser: boolean;
  userContentForm: User = {} as User;
  loading = false;
  async ngOnInit() {
    this.loading = true;
    this.title = this.getData['title'];
    this.buttonTitle = this.getData['buttonTitle'];
    if (this.getData['user']) {
      this.userContentForm.email = this.getData['user'].email;
      this.userContentForm.password = this.getData['user'].password;
      this.userContentForm.firstName = this.getData['user'].firstName;
      this.userContentForm.lastName = this.getData['user'].lastName;
      this.userContentForm.secondSurname = this.getData['user'].secondSurname;
      this.userContentForm.status = this.getData['user'].status;
      this.userContentForm.username = this.getData['user'].username;
      this.isNewUser = false;

    } else {
      this.isNewUser = true;
    }
    this.loading = false;
  }

  async manageUser() {
    if (this.validateForm()) {
      try {
        const userInfo = Object.assign({}, this.userContentForm);
        if (this.isNewUser) {
          const res = await this.userService.add(userInfo).toPromise();
          if (res) {
            this.toastService.showToast('success', 'Confirmación', 'Registro creado exitosamente');
          } else {
            this.toastService.showWarning('Error actualizando usuario');
          }
        } else {
          const id = this.getData['user'].id;
          const editUser = Object.assign({});
          editUser.email = this.userContentForm.email;
          editUser.firstName = this.userContentForm.firstName;
          editUser.lastName = this.userContentForm.lastName;
          editUser.secondSurname = this.userContentForm.secondSurname ? this.userContentForm.secondSurname : '';
          editUser.status = this.userContentForm.status;
          editUser.username = this.userContentForm.username;
          const res = await this.userService.update(id, editUser).toPromise();
          if (res) {
            this.toastService.showToast('success', 'Confirmación', 'Registro actualizado');
          } else {
            this.toastService.showWarning('Error actualizando usuario');
          }
        }
        this.dialogRef.close(userInfo);
      } catch (error) {
        this.toastService.showError(error.message || error);
      }
    }
  }

  validateForm() {
    if (!this.userContentForm.username) {
      this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese Nombre de usuario');
      return false;
    } else if (!this.userContentForm.firstName) {
      this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese un Nombre');
      return false;
    } else if (this.userContentForm.username.length < 2) {
      this.toastService.showToast('warning', 'Error de validación', 'Nombre de usuario debe tener mínimo 2 caracteres');
      return false;
    } else if (!this.userContentForm.lastName) {
      this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese un Apellido');
      return false;
    } else if (!this.userContentForm.email) {
      this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese un Email');
      return false;
    } else if (!this.userContentForm.password && this.isNewUser) {
      this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese una Contraseña');
      return false;
    } else if (this.userContentForm.password !== this.passwordRepeat && this.isNewUser) {
      this.toastService.showToast('warning', 'Error de validación', 'Las contraseñas no coinciden, intente nuevamente');
      return false;
    } else if (!this.passwordRepeat && this.isNewUser) {
      this.toastService.showToast('warning', 'Error de validación', 'Confirme Contraseña');
      return false;
    } else {
      let username = this.getData['allUsers'];
      if (!this.isNewUser) {
        username = username.filter(dem => dem.id !== this.getData['user'].id);
      }
      const matchUserName = username.find((u) => u.username === this.userContentForm.username);
      if (matchUserName) {
        this.toastService.showToast(
          'warning',
          'Error de validación',
          'El nombre de usuario "' + this.userContentForm.username + '" ya se encuentra registrado!'
        );
        return false;
      }
    }
    return true;
  }

}
