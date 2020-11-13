import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../../services/toast.service';
import { SystemParameter } from '../../../../models/system-parameter';
import { SystemParametersService } from '../../../../services/system-parameters.service';
import { List, ListItem } from '../../../../models/list';
import { ListService } from '../../../../services/list.service';


@Component({
  selector: 'ngx-dialog-system-parameters',
  templateUrl: './dialog-system-parameters.component.html',
  styleUrls: ['./dialog-system-parameters.component.scss']
})
export class DialogSystemParametersComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogSystemParametersComponent>,
    public dialog: MatDialog,
    public systemParameterService: SystemParametersService,
    private toastService: ToastService,
    private listService: ListService,

    @Inject(MAT_DIALOG_DATA) public getData: any,
  ) { }
  title: string;
  isList = false;
  isBool = false;
  isText = false;
  currentBoolState = false;
  systemParameterData: SystemParameter;
  list: List = {} as List;
  listItems: ListItem[] = [];
  async ngOnInit() {
    this.title = this.getData.title;
    this.systemParameterData = this.getData.systemParameterData;
    if (this.getData.parsedValue === true || this.getData.parsedValue === false) {
      this.isBool = true;
      this.currentBoolState = this.getData.parsedValue;
    } else if (this.systemParameterData.listId) {
      this.isList = true;
      const parameterList = await this.listService.getById(this.systemParameterData.listId).toPromise();
      if (parameterList.status && parameterList.data) {
        this.list = parameterList.data;
        const itemsList = await this.listService.getListItems(this.list.id).toPromise();
        this.listItems = itemsList.status && itemsList.data ? itemsList.data : [];
      }
    } else {
      if (!this.isBool && !this.isList) {
        this.isText = true;
      }
    }


  }
  updateToggle(boolVar) {
    this.systemParameterData.value = boolVar.toString();
    return boolVar;
  }
  async submit() {
    if (this.validateForm())
      try {
        const sysPar = Object.assign({}, this.systemParameterData);
        if (sysPar.id) {
          if (sysPar.listItemId) {
            sysPar.value = this.listItems.find(i => i.id === sysPar.listItemId).description;
          }
          const id = sysPar.id;
          delete sysPar.id;
          delete sysPar.listId;
          delete sysPar.userId;
          const res = await this.systemParameterService.update(id, sysPar).toPromise();
          if (res.status && res.data) {
            this.toastService.showToast('success', 'Info', 'Registro creado exitosamente');
            this.dialogRef.close(sysPar);
          } else {
            this.toastService.showWarning('Error en la creación');
            this.dialogRef.close();
          }
        }
      } catch (error) {
        this.toastService.showError(error.message || error);
      }
  }

  validateForm() {
    if (!this.systemParameterData.description) {
      this.toastService.showToast('danger', 'Info', 'Debe ingresar descripción');
      return false;
    }
    return true;
  }

}
