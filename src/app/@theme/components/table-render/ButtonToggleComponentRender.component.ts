import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
    template: `
    <mat-slide-toggle
        [(ngModel)]="rowData.status"
        [ngModelOptions]="{standalone: true}"
        (change)="updateStatus()" >
        {{rowData.status? 'Activo':'Inactivo'}}
    </mat-slide-toggle>
    `,
})
export class ButtonToggleComponent {
    @Input() value;
    @Input() rowData: any;
    @Output() update: EventEmitter<any> = new EventEmitter();

    updateStatus() {
        this.update.emit(this.rowData);
    }
}
