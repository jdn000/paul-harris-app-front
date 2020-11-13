import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
    template: `
    <button mat-raised-button color="primary"(click)="openDialog()">
        Cambiar contraseña
    </button>
    `,
})
export class ChangePasswordComponent {

    @Input() rowData: any;
    @Output() update: EventEmitter<any> = new EventEmitter();

    openDialog() {
        this.update.emit(this.rowData);
    }
}
