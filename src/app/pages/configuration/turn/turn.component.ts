import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TurnService } from '../../../services/turn.service';
import { Turn } from '../../../models/turn';
import { ToastService } from '../../../services/toast.service';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { MatDialog } from '@angular/material/dialog';
import { DialogTurnManagerComponent } from './dialog-turn-manager/dialog-turn-manager.component';
import { ButtonToggleComponent } from '../../../@theme/components/table-render/ButtonToggleComponentRender.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  selector: 'ngx-turn',
  templateUrl: './turn.component.html',
  styleUrls: ['./turn.component.scss']
})
export class TurnComponent implements OnInit, AfterViewInit {

  constructor(
    private readonly turnService: TurnService,
    private readonly toastService: ToastService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
  ) { }

  loading: boolean = false;
  turn: Turn[] = [];
  turnData: Turn = {} as Turn;

  @ViewChild('table') smartTable: Ng2SmartTableComponent;

  settings = {
    mode: 'external',
    actions: {
      position: 'right',
      columnTitle: 'Acción',
      delete: false,
      width: '10%',
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
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return '<img width="18px" src="assets/images/clock.png" />&nbsp;&nbsp;&nbsp;' + row.code;
        },
      },
      startHour: {
        title: 'Desde',
        type: 'string',
      },
      endHour: {
        title: 'Hasta',
        type: 'string',
      },
      status: {
        width: '10%',
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

  async ngOnInit() {
    await this.load();
  }

  async load() {
    try {
      const res = await this.turnService.getAll().toPromise();
      this.turn = res && res.status ? res.data : [];
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }

  ngAfterViewInit(): void {
    this.smartTable.edit.subscribe((dataObject: any) => {
      this.turnData = dataObject['data'];
      this.openDialog();
    });
    this.smartTable.create.subscribe((dataObject: any) => {
      this.turnData = null;
      this.openDialog();
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogTurnManagerComponent, {
      data: {
        allTurn: this.turn,
        turn: this.turnData,
        title: this.turnData ? 'Actualizar Registro Turno' : 'Nuevo Registro Turno',
        buttonTitle: this.turnData ? 'EDITAR' : 'CREAR',
      },
      width: '35%',
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
      const editTurn = Object.assign({});
      editTurn.code = row.code;
      editTurn.startHour = row.startHour;
      editTurn.endHour = row.endHour;
      editTurn.status = row.status ? true : false;
      await this.turnService.update(row.id, editTurn).toPromise();
      this.openSnackBar('Registro actualizado', row.status ? 'ACTIVO' : 'INACTIVO');
      this.router.navigate(['/pages/configuration/turn/']);
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
