import { Component, Inject, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { Subject } from '../../../../models/subject';
import { UserSubject } from '../../../../models/user';
import { SubjectService } from '../../../../services/subject.service';
import { ToastService } from '../../../../services/toast.service';
import { UserSubjectService } from '../../../../services/userSubject.service';
import { DialogUserManagerComponent } from '../dialog-user-manager/dialog-user-manager.component';

@Component({
  selector: 'ngx-dialog-user-subject',
  templateUrl: './dialog-user-subject.component.html',
  styleUrls: ['./dialog-user-subject.component.scss']
})
export class DialogUserSubjectComponent implements OnInit {
  userId: number;
  checked: boolean;


  allSubjects: Subject[] = [];
  subjects: Subject[] = [];
  selectedSubjects: Subject[] = [];
  unSelectedSubjects: Subject[] = [];

  userSubjects: UserSubject[] = [];
  selectedUserSubject: UserSubject[];
  modSelectedArray: Subject[] = [];
  selectedOptions = [{ name: 'Boots', id: 1 }];
  //compareFunction = (o1: any, o2: any)=> o1.id===o2.id;

  typesOfShoes: { name: string, id: number; }[] = [
    { name: 'Boots', id: 1 },
    { name: 'Clogs', id: 2 },
    { name: 'Loafers', id: 3 },
    { name: 'Moccasins', id: 4 },
    { name: 'Sneakers', id: 5 }
  ];
  constructor(
    private readonly userSubjectService: UserSubjectService,
    public dialogRef: MatDialogRef<DialogUserManagerComponent>,
    public dialog: MatDialog,
    private toastService: ToastService,
    private readonly subjectService: SubjectService,
    @Inject(MAT_DIALOG_DATA) public getData: {
      userId: number;
      subjects: Subject[];
    },
  ) { }

  async ngOnInit() {
    this.subjects = this.getData.subjects;

    this.userId = this.getData.userId;

    this.userSubjects = [];
    this.userSubjects = await this.userSubjectService.getByUserId(this.getData.userId).toPromise();
    this.userSubjects.forEach((u) => {
      const selRodMod = this.subjects.find((s) => s.id === u.subjectId);
      if (selRodMod) {
        this.selectedSubjects.push(selRodMod);
        this.allSubjects.push(selRodMod);
      }


    });
    this.subjects.forEach((sb) => {
      const selRodMod = this.selectedSubjects.find(k => k.id === sb.id);
      if (!selRodMod) {
        this.unSelectedSubjects.push(sb);
        this.allSubjects.push(sb);
      }
    });

  }
  // async openDialog(): Promise<void> {
  //   const rolMods = await this.roleService.getAllRoleModule().toPromise();
  //   const roleModules = rolMods && rolMods.status ? rolMods.data : [];
  //   const selectedModules: Module[] = [];
  //   let selectedSubjects: RoleModule[] = [];
  //   const allModules: Module[] = [];
  //   const unselectedModules: Module[] = [];
  //   let moduleSelected: Module;
  //   const modSelectedArray: Module[] = [];

  // }
  async onChange(change: MatSelectionListChange) {

    if (change.option.selected === true) {
      const selMod = this.selectedSubjects.find(module => module.id === change.option.value.id);
      if (!selMod) {
        this.selectedSubjects.push(change.option.value);
        this.unSelectedSubjects = this.unSelectedSubjects.filter(mod => mod.id !== change.option.value.id);
      }

    }
    if (change.option.selected === false) {
      const unselMod = this.unSelectedSubjects.find(module => module.id === change.option.value.id);

      if (!unselMod) {
        this.unSelectedSubjects.push(change.option.value);
        this.selectedSubjects = this.selectedSubjects.filter(mod => mod.id !== change.option.value.id);
      }

    }
  }

  isChecked(): boolean {
    return this.checked;
  }
  toggleSelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.selectedSubjects = this.subjects;
      this.unSelectedSubjects = [];
    } else {
      this.selectedSubjects = [];
      this.unSelectedSubjects = this.subjects;
    }
  }

  compareFunction = (o1: any, o2: any) => o1.id === o2.id;
  async submit() {

    try {

      this.selectedSubjects.forEach(async (subject) => {
        if (this.userSubjects) {
          const userSubj = this.userSubjects.find(us => us.subjectId === subject.id);
          if (!userSubj) {
            let userSubject: UserSubject;
            userSubject = { userId: this.userId, subjectId: subject.id };
            const addUS = await this.userSubjectService.add(userSubject).toPromise();
            if (!addUS) this.toastService.showWarning('Error en la creación');
          }
        } else {
          let userSubject: UserSubject;
          userSubject = { userId: this.userId, subjectId: subject.id };
          const addUS = await this.userSubjectService.add(userSubject).toPromise();
          if (!addUS) this.toastService.showWarning('Error en la creación');
        }
      });
      this.unSelectedSubjects.forEach(async (sub) => {
        const userSubj = this.userSubjects.find(u => u.subjectId === sub.id);
        if (userSubj) {
          const del = await this.userSubjectService.delete(userSubj.id).toPromise();
          if (!del) this.toastService.showWarning('Error en la edición');
        }
      });
      this.toastService.showToast('success', 'Confirmación', 'Registro actualizado');

      this.dialogRef.close();



    } catch (error) {
      this.toastService.showError(error.message || error);
    }

  }

}


export class ListSelectionExample {
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
}