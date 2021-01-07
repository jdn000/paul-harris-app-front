import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Grade } from '../../../models/grade';
import { User } from '../../../models/user';
import { GradeService } from '../../../services/grade.service';
import { ToastService } from '../../../services/toast.service';
import { UserService } from '../../../services/user.service';
import { DialogGradeManagerComponent } from './dialog-grade-manager/dialog-grade-manager.component';

@Component({
  selector: 'ngx-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.scss']
})
export class GradeComponent implements OnInit {

  constructor(
    private readonly gradeService: GradeService,
    private readonly userService: UserService,
    private readonly toastService: ToastService,
    private readonly dialog: MatDialog,
    private readonly ngxService: NgxUiLoaderService,

  ) { }

  loading = false;

  users: User[] = [];
  grades: Grade[] = [];
  gradeData: Grade = {} as Grade;

  async ngOnInit() {
    this.ngxService.startLoader('grade');
    this.users = await this.userService.getAll().toPromise();
    this.grades = await this.gradeService.getAll().toPromise();
    this.ngxService.stopLoader('grade');
  }

  ngAfterViewInit(): void {
    this.smartTable.edit.subscribe((dataObject: any) => {
      this.gradeData = dataObject['data'];
      this.openDialog();
    });
  }



  openDialog(): void {
    this.dialog.open(DialogGradeManagerComponent, {
      data: {
        users: this.users,
        gradeData: this.gradeData,
        title: 'Actualizar información curso',
        buttonTitle: 'Guardar',
      },
      width: '40%',
      disableClose: true,
      panelClass: 'custom-modalbox',
    }).afterClosed().subscribe(async (data) => {
      if (data) {
        await this.ngOnInit();
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
      name: {
        title: 'Nombre',
        type: 'string',
      },
      gradeNumber: {
        title: 'Número de curso',
        type: 'string',
      },
      description: {
        title: 'Descripción',
        type: 'string',

      },
      headTeacherId: {
        title: 'Profesor Jefe',
        type: 'string',
        valuePrepareFunction: (cell, row) => {
          const u = this.users.find((d) => d.id === row.headTeacherId);
          return `${u.firstName} ${u.lastName}`;
        },
      },
    },
  };
}
