import { Component } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
    selector: 'ngx-input-editor',
    template: `
        <input type="number"
        [(ngModel)]="cell.newValue"
        class="form-control"
        [name]="cell.getId()"
        [placeholder]="cell.getTitle()"
        [disabled]="!cell.isEditable()"
        (click)="onClick.emit($event)"
        (keydown.enter)="onEdited.emit($event)"
        (keydown.esc)="onStopEditing.emit()">
    `,
})
export class InputNumberComponent extends DefaultEditor {
    constructor() {
        super();
    }
}
