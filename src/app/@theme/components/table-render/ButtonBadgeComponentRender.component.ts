import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
    selector: 'ngx-badge-button',
    template: `
    <button mat-raised-button color="primary" matBadge={{res}} matBadgeColor="accent" (click)="openDialog()">
        Módulos
    </button>
    `,
})
export class ButtonBadgeComponent {
    @Input() value: any;
    @Input() rowData: any;
    @Input() res: any;
    @Output() update: EventEmitter<any> = new EventEmitter();
    openDialog() {

        this.update.emit(this.rowData);
    }
}
