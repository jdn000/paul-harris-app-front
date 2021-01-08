import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';
import { User } from '../../../models/user';


import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { MatDialog } from '@angular/material/dialog';
import { DialogUserManagerComponent } from './dialog-user-manager/dialog-user-manager.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogChangePasswordComponent } from './dialog-change-password/dialog-change-password.component';
import { ButtonToggleDisabledComponent } from '../../../@theme/components/table-render/ToggleDisabledButton.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ChangePasswordComponent } from '../../../@theme/components/table-render/ChangePasswordComponentRender.component';
import { DialogUserSubjectComponent } from './dialog-user-subject/dialog-user-subject.component';

import { SubjectService } from '../../../services/subject.service';
import { Subject } from '../../../models/subject';
import { addSubjectsAccess } from '../../../@theme/components/table-render/addSubjectsAccess.component';

@Component({
  selector: 'ngx-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, AfterViewInit {

  constructor(
    private readonly userService: UserService,
    private readonly toastService: ToastService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly ngxService: NgxUiLoaderService,
    private readonly subjectService: SubjectService,
  ) { }

  loading = false;

  users: User[] = [];
  subjects: Subject[] = [];
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
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
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
      lastName: {
        title: 'Apellidos',
        type: 'html',
        valuePrepareFunction: (cell, row) => {

          return ` ${row.lastName}   ${row.secondSurname}`;
        },
      },
      email: {
        title: 'Email',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return '<a href="mailto:' + row.email + '" target="_blank" ><small>' + row.email + '</small></a>';
        },
      },

      status: {
        title: 'Estado',
        type: 'custom',
        filter: false,
        renderComponent: ButtonToggleDisabledComponent
      },
      changePass: {
        title: '',
        type: 'custom',
        renderComponent: addSubjectsAccess,
        onComponentInitFunction: (instance) => {
          instance.update.subscribe((row) => {
            this.openSubjectDialog(row);
          });
        },
      },
    },
  };

  async ngOnInit() {
    this.ngxService.startLoader('us');
    await this.load();
    this.subjects = await this.subjectService.getAll().toPromise();
    this.ngxService.stopLoader('us');
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

      const res = await this.userService.getAll().toPromise();
      this.users = res;
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
      if (data) {
        await this.load();
      }
    });
  }
  openSubjectDialog(userInfo: User): void {
    this.dialog.open(DialogUserSubjectComponent, {
      data: {
        subjects: this.subjects,
        userId: userInfo.id,

      },
      width: '40%',
      disableClose: true,
      panelClass: 'custom-modalbox',
    }).afterClosed().subscribe(async (data) => {

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
      if (data) {
        await this.load();
      }
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
