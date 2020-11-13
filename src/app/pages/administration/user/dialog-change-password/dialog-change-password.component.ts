import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogUserManagerComponent } from '../dialog-user-manager/dialog-user-manager.component';
import { UserService } from '../../../../services/user.service';
import { RoleService } from '../../../../services/role.service';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../../services/auth.service';


@Component({
  selector: 'ngx-dialog-change-password',
  templateUrl: './dialog-change-password.component.html',
  styleUrls: ['./dialog-change-password.component.scss']
})
export class DialogChangePasswordComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogUserManagerComponent>,
    public dialog: MatDialog,
    public userService: UserService,
    public roleService: RoleService,
    private toastService: ToastService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public getData: any) { }
  title: string;
  buttonTitle: string;
  passwordRepeat: string;
  userContentForm = {
    password: null,
    username: null,
    firstName: null,
    lastName: null,
    secondSurName: null,
    email: null,
  };
  loading = false;

  async ngOnInit() {
    this.loading = true;
    this.title = this.getData['title'];
    this.buttonTitle = this.getData['buttonTitle'];
    if (this.getData['user']) {
      this.userContentForm.password = '';
      this.userContentForm.username = this.getData['user'].username;
      this.userContentForm.firstName = this.getData['user'].firstName;
      this.userContentForm.lastName = this.getData['user'].lastName;
      this.userContentForm.secondSurName = this.getData['user'].secondSurName;
      this.userContentForm.email = this.getData['user'].email;
    }
    this.loading = false;
  }
  async manageUser() {
    try {
      if (this.validateNewForm()) {
        if (this.getData['user']) {
          const editUser = Object.assign({});
          editUser.email = this.getData['user'].email;
          editUser.firstName = this.getData['user'].firstName;
          editUser.lastName = this.getData['user'].lastName;
          editUser.secondSurName = this.getData['user'].secondSurName;
          editUser.status = this.getData['user'].status;
          editUser.username = this.getData['user'].username;
          editUser.roleId = this.getData['user'].roleId;
          editUser.profileImage = this.getData['user'].profileImage;
          editUser.password = this.userContentForm.password;
          const res = await this.authService.resetPassword(this.getData['user'].id, editUser).toPromise();
          if (res) {
            this.toastService.showToast('success', 'Confirmación', 'Contraseña actualizada');
          } else {
            this.toastService.showWarning('Error actualizando contraseña');
          }
          this.dialogRef.close(editUser);
        }
      }
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }

  validateNewForm() {
    if (!this.userContentForm.password) {
      this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese una contraseña');
      return false;
    } else if (!this.passwordRepeat) {
      this.toastService.showToast('warning', 'Dato Incompleto', 'Confirme Contraseña');
      return false;
    } else if (this.userContentForm.password !== this.passwordRepeat) {
      this.toastService.showToast('warning', 'Error de validación', 'Las contraseñas no coinciden, intente nuevamente');
      return false;
    }
    return true;

  }

}
