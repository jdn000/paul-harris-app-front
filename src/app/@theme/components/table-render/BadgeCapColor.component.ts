import { Component, Input } from '@angular/core';
@Component({
    template: `
    <input type="color" value="{{rowData.capColor}}">
    `,
})
export class BadgeCapColorTubeComponent {
    @Input() rowData: any;
}
