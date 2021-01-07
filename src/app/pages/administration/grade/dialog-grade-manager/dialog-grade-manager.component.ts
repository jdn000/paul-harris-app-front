import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Grade } from '../../../../models/grade';
import { User } from '../../../../models/user';
import { GradeService } from '../../../../services/grade.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'ngx-dialog-grade-manager',
  templateUrl: './dialog-grade-manager.component.html',
  styleUrls: ['./dialog-grade-manager.component.scss']
})
export class DialogGradeManagerComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogGradeManagerComponent>,
    public dialog: MatDialog,
    private readonly gradeService: GradeService,
    private toastService: ToastService,

    @Inject(MAT_DIALOG_DATA) public getData: {

      users: User[];
      gradeData: Grade;
      title: string;
      buttonTitle: string;
    },
  ) { }

  title: string;
  buttonTitle: string;

  gradeContentForm: Grade = {} as Grade;
  usersData: User[] = [];
  loading = false;
  async ngOnInit() {
    this.loading = true;
    this.title = this.getData.title;
    this.buttonTitle = this.getData.buttonTitle;
    this.usersData = this.getData.users;
    if (this.getData.gradeData) {
      this.gradeContentForm = this.getData.gradeData;

    }
    this.loading = false;
  }

  async manageGrade() {
    try {
      const gradeInfo = Object.assign({}, this.gradeContentForm);
      const id = gradeInfo.id;
      delete gradeInfo.id;
      const res = await this.gradeService.update(id, gradeInfo).toPromise();
      if (res) {
        this.toastService.showToast('success', 'Confirmación', 'Registro actualizado');
      } else {
        this.toastService.showWarning('Error actualizando curso');
      }
      this.dialogRef.close(gradeInfo);
    } catch (error) {
      this.toastService.showError(error.message || error);
    }

  }

}
