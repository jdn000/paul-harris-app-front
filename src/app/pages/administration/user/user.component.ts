import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';
import { User } from '../../../models/user';
import { Role } from '../../../models/role';
import { RoleService } from '../../../services/role.service';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { MatDialog } from '@angular/material/dialog';
import { DialogUserManagerComponent } from './dialog-user-manager/dialog-user-manager.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogChangePasswordComponent } from './dialog-change-password/dialog-change-password.component';
import { ButtonToggleDisabledComponent } from '../../../@theme/components/table-render/ToggleDisabledButton.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'ngx-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, AfterViewInit {

  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly toastService: ToastService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly ngxService: NgxUiLoaderService,
  ) { }

  loading: boolean = false;
  users: User[] = [];
  roles: Role[] = [];
  userData: User = {} as User;

  @ViewChild('table') smartTable: Ng2SmartTableComponent;

  settings = {
    mode: 'external',
    actions: {
      position: 'right',
      columnTitle: 'Acción',
      delete: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-locked"></i>',
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
      username: {
        title: 'Usuario',
        sortDirection: 'desc',
      },
      firstName: {
        title: 'Nombres',
        type: 'string',
      },
      lastname: {
        title: 'Apellidos',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return row.lastName + ' ' + row.secondSurName;
        },
      },
      email: {
        title: 'Email',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return '<a href="mailto:' + row.email + '" target="_blank" ><small>' + row.email + '</small></a>';
        },
      },
      roleId: {
        title: 'Rol',
        type: 'html',
        valuePrepareFunction: (data) => {
          const role = this.roles.find((rl) => rl.id === data).description;
          return '<small><strong>' + role + '</strong></small>';
        },
      },
      status: {
        title: 'Estado',
        type: 'custom',
        filter: false,
        renderComponent: ButtonToggleDisabledComponent
      },
      /*changePass: {
        title: '',
        type: 'custom',
        renderComponent: ChangePasswordComponent,
        onComponentInitFunction: (instance) => {
          instance.update.subscribe((row) => {
            this.openChangePasswordDialog(row);
          });
        },
      },*/
    },
  };

  async ngOnInit() {
    this.ngxService.startLoader('loader');
    await this.load();
    this.ngxService.stopLoader('loader');
  }

  ngAfterViewInit(): void {
    this.smartTable.edit.subscribe((dataObject: any) => {
      this.userData = dataObject['data'];
      this.openDialog();
    });
    this.smartTable.create.subscribe((dataObject: any) => {
      this.userData = null;
      this.openDialog();
    });
    this.smartTable.delete.subscribe((dataObject: any) => {
      this.openChangePasswordDialog(dataObject['data']);
    });
  }

  async load() {
    try {
      const rol = await this.roleService.getAll().toPromise();
      this.roles = rol && rol.status ? rol.data : [];
      const res = await this.userService.getAll().toPromise();
      this.users = res && res.status ? res.data : [];
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }

  openDialog(): void {
    this.dialog.open(DialogUserManagerComponent, {
      data: {
        allUsers: this.users,
        user: this.userData,
        title: this.userData ? 'Actualizar Usuario' : 'Nuevo Usuario',
        buttonTitle: this.userData ? 'EDITAR' : 'CREAR',
      },
      width: '40%',
      disableClose: true,
      panelClass: 'custom-modalbox',
    }).afterClosed().subscribe(async (data) => {
      if (data)
        await this.load();
    });
  }
  openChangePasswordDialog(userInfo: User): void {
    this.dialog.open(DialogChangePasswordComponent, {
      data: {
        allUsers: this.users,
        user: userInfo,
        title: 'Actualizar Contraseña',
        buttonTitle: 'ACTUALIZAR',
      },
      width: '40%',
      disableClose: true,
      panelClass: 'custom-modalbox',
    }).afterClosed().subscribe(async (data) => {
      if (data)
        await this.load();
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }

}
