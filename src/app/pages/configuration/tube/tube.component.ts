import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TubeService } from '../../../services/tube.service';
import { Tube } from '../../../models/tube';
import { ToastService } from '../../../services/toast.service';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { MatDialog } from '@angular/material/dialog';
import { DialogTubeManagerComponent } from './dialog-tube-manager/dialog-tube-manager.component';
import { ButtonToggleComponent } from '../../../@theme/components/table-render/ButtonToggleComponentRender.component';
import { BadgeBorderColorTubeComponent } from '../../../@theme/components/table-render/BadgeBorderColor.component';
import { BadgeCapColorTubeComponent } from '../../../@theme/components/table-render/BadgeCapColor.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-tube',
  templateUrl: './tube.component.html',
  styleUrls: ['./tube.component.scss']
})
export class TubeComponent implements OnInit, AfterViewInit {

  loading: boolean = false;
  tube: Tube[] = [];
  tubeData: Tube = {} as Tube;

  @ViewChild('table') smartTable: Ng2SmartTableComponent;

  settings = {
    mode: 'external',
    actions: {
      position: 'right',
      columnTitle: 'Acción',
      delete: false,
      width: '5%',
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
        width: '25%',
        sortDirection: 'desc',
        title: 'Código',
        type: 'string',
      },
      description: {
        width: '25%',
        title: 'Descripción',
        type: 'string',
      },
      abbreviation: {
        width: '10%',
        title: 'Abreviación',
        type: 'string',
      },
      borderColor: {
        width: '10%',
        title: 'Color Borde',
        type: 'custom',
        filter: false,
        renderComponent: BadgeBorderColorTubeComponent,
      },
      capColor: {
        width: '10%',
        title: 'Color Tapa',
        type: 'custom',
        filter: false,
        renderComponent: BadgeCapColorTubeComponent,
      },
      status: {
        width: '5%',
        title: 'Estado',
        type: 'custom',
        filter: false,
        renderComponent: ButtonToggleComponent,
        onComponentInitFunction: (instance) => {
          instance.update.subscribe((row) => {
            this.updateStatus(row);
          });
        },
      },
    },
  };

  constructor(
    private readonly tubeService: TubeService,
    private readonly toastService: ToastService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
  ) { }

  async ngOnInit() {
    await this.load();
  }

  async load() {
    try {
      const res = await this.tubeService.getAll().toPromise();
      this.tube = res && res.status ? res.data : [];
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }

  ngAfterViewInit(): void {
    this.smartTable.edit.subscribe((dataObject: any) => {
      this.tubeData = dataObject['data'];
      this.openDialog();
    });
    this.smartTable.create.subscribe((dataObject: any) => {
      this.tubeData = null;
      this.openDialog();
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogTubeManagerComponent, {
      data: {
        allTubes: this.tube,
        tube: this.tubeData,
        title: this.tubeData ? 'Actualizar Registro Contenedor' : 'Nuevo Registro Contenedor',
        buttonTitle: this.tubeData ? 'EDITAR' : 'CREAR',
      },
      width: '45%',
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
    try {
      const editTube = Object.assign({});
      editTube.code = row.code;
      editTube.description = row.description;
      editTube.abbreviation = row.abbreviation;
      editTube.borderColor = row.borderColor;
      editTube.capColor = row.capColor;
      editTube.status = row.status ? true : false;
      await this.tubeService.update(row.id, editTube).toPromise();
      this.openSnackBar('Registro actualizado', row.status ? 'ACTIVO' : 'INACTIVO');
      this.router.navigate(['/pages/configuration/tube/']);
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }

}
