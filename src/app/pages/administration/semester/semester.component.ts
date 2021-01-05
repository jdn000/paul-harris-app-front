import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { ButtonToggleDisabledComponent } from '../../../@theme/components/table-render/ToggleDisabledButton.component';
import { Grade } from '../../../models/grade';
import { Semester } from '../../../models/semester';
import { GradeService } from '../../../services/grade.service';
import { SemesterService } from '../../../services/semester.service';
import { ToastService } from '../../../services/toast.service';
import { DialogSemesterComponent } from './dialog-semester/dialog-semester.component';

@Component({
  selector: 'ngx-semester',
  templateUrl: './semester.component.html',
  styleUrls: ['./semester.component.scss']
})
export class SemesterComponent implements OnInit {
  semesters: Semester[] = [];
  semesterData: Semester = {} as Semester;
  gradeId: number;
  grades: Grade[] = [];
  openSync = false;
  constructor(
    private readonly semesterService: SemesterService,
    private readonly toastService: ToastService,
    private readonly dialog: MatDialog,
    private readonly gradeService: GradeService

  ) { }


  async ngOnInit() {
    await this.load();

  }

  async load() {
    try {
      this.semesters = await this.semesterService.getAll().toPromise();
      this.grades = await this.gradeService.getAll().toPromise();
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }
  openDialog(): void {
    this.dialog.open(DialogSemesterComponent, {
      data: {
        all: this.semesters,
        semester: this.semesterData,
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
  ngAfterViewInit(): void {
    this.smartTable.edit.subscribe((dataObject: any) => {
      this.semesterData = dataObject['data'];
      this.openDialog();
    });
  }
  openSyncMenu() {
    this.openSync = !this.openSync;
  }
  async syncCalifications() {
    const sync = await this.semesterService.sync(this.gradeId).toPromise();
    sync ? this.toastService.showSuccess('Notas sincronizadas') : this.toastService.showInfo('No se pudo sincronizar');
  }
  @ViewChild('table') smartTable: Ng2SmartTableComponent;

  settings = {
    mode: 'external',
    actions: {
      position: 'right',
      columnTitle: 'Acción',
      delete: false,
      add: false
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
      code: {
        title: 'Código',
        sortDirection: 'desc',
      },
      description: {
        title: 'descripción',
        type: 'string',
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
