import { Component, Input } from '@angular/core';

@Component({
    template: `
    <input type="color" value="{{rowData.borderColor}}">
    `,
})
export class BadgeBorderColorTubeComponent {
    @Input() rowData: any;
}
