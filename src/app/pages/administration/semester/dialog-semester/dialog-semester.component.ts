import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Semester } from '../../../../models/semester';
import { SemesterService } from '../../../../services/semester.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'ngx-dialog-semester',
  templateUrl: './dialog-semester.component.html',
  styleUrls: ['./dialog-semester.component.scss']
})
export class DialogSemesterComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogSemesterComponent>,
    public dialog: MatDialog,
    public semesterService: SemesterService,
    private toastService: ToastService,
    @Inject(MAT_DIALOG_DATA) public getData: { semester: Semester, all: Semester[]; },
  ) { }
  semesterContentForm: Semester = {} as Semester;
  allSemesters: Semester[] = [];
  allDisabled = false;
  async ngOnInit() {

    if (this.getData.semester) {
      this.semesterContentForm.id = this.getData.semester.id;
      this.semesterContentForm.description = this.getData.semester.description;
      this.semesterContentForm.code = this.getData.semester.code;
      this.semesterContentForm.status = this.getData.semester.status;
      this.allSemesters = this.getData.all;
      this.allSemesters = this.allSemesters.filter((s) => s.status === true && s.id !== this.getData.semester.id);
      if (!this.allSemesters.length) {
        this.allDisabled = true;
      }
    }

  }
  async manageSemester() {
    try {
      const semesterInfo = Object.assign({}, this.semesterContentForm);
      const id = this.getData.semester.id;
      const editSemester = Object.assign({});
      editSemester.id = this.semesterContentForm.id;
      editSemester.description = this.semesterContentForm.description;
      editSemester.code = this.semesterContentForm.code;
      editSemester.status = this.semesterContentForm.status;
      if (!this.allDisabled && editSemester.status === true) {
        const res = await this.semesterService.update(id, editSemester).toPromise();
        if (res) {
          if (this.allSemesters.length) {
            this.allSemesters.map(async (d) => {
              d.status = false;
              return await this.semesterService.update(d.id, d).toPromise();
            });
          }
          this.toastService.showToast('success', 'Confirmación', 'Registro actualizado');
        } else {
          this.toastService.showWarning('Error actualizando usuario');
        } this.dialogRef.close(semesterInfo);
      } else {
        this.toastService.showWarning('debe haber al menos un semestre activo');
      }


    } catch (error) {
      this.toastService.showError(error.message || error);
    }

  }
}
