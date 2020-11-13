import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SystemParametersService } from '../../../services/system-parameters.service';
import { ToastService } from '../../../services/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Ng2SmartTableComponent, LocalDataSource } from 'ng2-smart-table';
import { SystemParameter } from '../../../models/system-parameter';
import { DialogSystemParametersComponent } from './dialog-system-parameters/dialog-system-parameters.component';
import { ToggleOrTextComponent } from '../../../@theme/components/table-render/ToggleOrText.component';

@Component({
  selector: 'ngx-system-parameters',
  templateUrl: './system-parameters.component.html',
  styleUrls: ['./system-parameters.component.scss']
})
export class SystemParametersComponent implements OnInit, AfterViewInit {

  systemParameterData: SystemParameter = {} as SystemParameter;
  systemParameters: SystemParameter[] = [];


  loading: boolean = false;
  settings = {
    mode: 'external',
    actions: {
      position: 'right',
      columnTitle: 'Editar',
      delete: false,
      add: false,
      width: '10%',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      confirmSave: true,
    },
    columns: {
      description: {
        title: 'Descripción',
        type: 'string',
        width: '60%',
      },
      value: {
        title: 'Valor',
        type: 'custom',
        width: '30%',
        valuePrepareFunction: (row) => {
          const isBoolean = this.checkIfIsBool(row);
          const value = isBoolean ? this.transformToBool(row) : row;
          return { value, isBoolean };
        },
        renderComponent: ToggleOrTextComponent
      },
    }
  };
  tableSource: LocalDataSource;

  @ViewChild('table') smartTable: Ng2SmartTableComponent;

  constructor(
    public systemParametersService: SystemParametersService,
    private toastService: ToastService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,

  ) {
    this.tableSource = new LocalDataSource();
  }

  ngAfterViewInit(): void {
    this.smartTable.edit.subscribe((dataObject: any) => {
      this.systemParameterData = dataObject['data'];
      this.openDialog();

    });
  }

  async ngOnInit() {
    await this.load();
  }

  async load() {
    try {
      const res = await this.systemParametersService.getAll().toPromise();
      const systemParam = res && res.status ? res.data : [];
      this.systemParameters = systemParam.filter((parameter) => parameter.isVisible === true);
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }
  checkIfIsBool(v) {
    switch (v) {
      case true:
      case 'true':
      case 1:
      case '1':
      case 'on':
      case 'yes':
      case false:
      case 'false':
      case 0:
      case '0':
      case 'off':
      case 'no':
        return true;

      default:
        return false;
    }
  }
  transformToBool(value) {
    switch (value) {
      case true:
      case 'true':
      case 1:
      case '1':
      case 'on':
      case 'yes':
        return true;
      case false:
      case 'false':
      case 0:
      case '0':
      case 'off':
      case 'no':
        return false;
      default:
        return 'Not bool';
    }
  }
  openDialog() {
    this.dialog.open(DialogSystemParametersComponent, {
      data: {
        systemParameterData: this.systemParameterData,
        parsedValue: this.transformToBool(this.systemParameterData.value),
        title: this.systemParameterData ? 'Actualizar registro' : 'Nuevo registro',
      },
      width: '40%',
      disableClose: true,
      panelClass: 'custom-modalbox',
    }).afterClosed().subscribe(async (data) => {
      if (data)
        await this.load();
    });
  }

  async updateStatus(row: SystemParameter) {
    this.systemParameterData = row;
    this.openDialog();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }

}

