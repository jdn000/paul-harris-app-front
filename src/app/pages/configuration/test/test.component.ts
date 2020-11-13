import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ToastService } from '../../../services/toast.service';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TestService } from '../../../services/test.service';
import { Test } from '../../../models/test';
import { DialogTestManagerComponent } from './dialog-test-manager/dialog-test-manager.component';
import { ButtonToggleDisabledComponent } from '../../../@theme/components/table-render/ToggleDisabledButton.component';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'ngx-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit, AfterViewInit {

  constructor(
    private readonly testService: TestService,
    private readonly toastService: ToastService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly ngxService: NgxUiLoaderService,
    private readonly router: Router,
  ) { }

  @ViewChild('table') smartTable: Ng2SmartTableComponent;
  loading: boolean = false;
  test: Test[] = [];
  versionTest: Test[] = [];
  testData: Test = {} as Test;

  async ngOnInit() {
    this.ngxService.startLoader('test');
    await this.load();
    this.ngxService.stopLoader('test');
  }

  async load() {
    try {
      const res = await this.testService.getAll().toPromise();
      this.test = res && res.status ? res.data : [];
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }


  ngAfterViewInit(): void {
    this.smartTable.edit.subscribe((dataObject: any) => {
      this.testData = dataObject['data'];
      this.openDialog();

    });
    this.smartTable.create.subscribe((dataObject: any) => {
      this.testData = null;
      this.openDialog();
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogTestManagerComponent, {
      data: {
        allTests: this.test,
        test: this.testData,
        title: this.testData ? 'Actualizar Registro Examen' : 'Nuevo Registro Examen',
        buttonTitle: this.testData ? 'EDITAR' : 'CREAR',
      },
      width: '95%',
      disableClose: true,
      panelClass: 'custom-modalbox',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.load();
      }
    });
  }

  async updateStatus(row) {
    const editSpecimen = Object.assign({});
    editSpecimen.code = row.code;
    editSpecimen.description = row.description;
    editSpecimen.isMicro = row.isMicro ? true : false;
    editSpecimen.status = row.status ? true : false;
    const res = await this.testService.update(row.id, editSpecimen).toPromise();
    if (res.status) {
      this.openSnackBar('Registro actualizado', row.status ? 'ACTIVO' : 'INACTIVO');
    } else {
      this.toastService.showWarning('Error actualizando usuario');
    }
    this.router.navigate(['/pages/configuration/specimen/']);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }
  settings = {
    mode: 'external',
    actions: {
      position: 'right',
      columnTitle: 'Acción',
      delete: false,
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
      code: {
        sortDirection: 'desc',
        title: 'Código',
        type: 'string',
      },
      description: {
        title: 'Descripción',
        type: 'string',
      },
      abbreviation: {
        title: 'Abreviación',
        type: 'string',
      },
      printable: {
        title: 'Imprimible',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          if (row.printable) {
            return '<span class="badge badge-primary" >Aplica</span>';
          } else {
            return '<span class="badge badge-secondary" >No aplica</span>';
          }
        },
      },
      isMicro: {
        title: 'Microbiología',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          if (row.isMicro) {
            return '<span class="badge badge-success" >Aplica</span>';
          } else {
            return '<span class="badge badge-secondary" >No aplica</span>';
          }
        },
      },
      status: {
        title: 'Estado',
        type: 'custom',
        filter: false,
        renderComponent: ButtonToggleDisabledComponent
      },
    },
  };
}
