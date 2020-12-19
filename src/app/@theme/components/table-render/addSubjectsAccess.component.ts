import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
    template: `
    <button mat-raised-button color="basic"(click)="openDialog()">
        Acceso a asignaturas
    </button>
    `,
})
export class addSubjectsAccess {

    @Input() rowData: any;
    @Output() update: EventEmitter<any> = new EventEmitter();

    openDialog() {
        this.update.emit(this.rowData);
    }
}
