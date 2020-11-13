import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
    template: `
    <mat-slide-toggle
        [(ngModel)]="rowData.customerCenter.status"
        [ngModelOptions]="{standalone: true}"
        (change)="updateStatus()" >
        {{rowData.customerCenter.status? 'Activo':'Inactivo'}}
    </mat-slide-toggle>
    `,
})
export class ButtonToggleCustomerComponent {
    @Input() value;
    @Input() rowData: any;
    @Output() update: EventEmitter<any> = new EventEmitter();

    updateStatus() {
        this.update.emit(this.rowData);
    }
}
