import { Component, Input } from '@angular/core';
@Component({
    template: `
    <div *ngIf="!value.isBoolean"(click)="updateStatus()">
{{rowData.value}}
  </div>
  <div *ngIf="value.isBoolean"(click)="updateStatus()">
    <mat-slide-toggle [(ngModel)]="value.value" [ngModelOptions]="{standalone: true}"
     disabled>
      {{value.value? 'Activo':'Inactivo'}}
    </mat-slide-toggle>
  </div>
  `,
})
export class ToggleOrTextComponent {
    @Input() value: any;
    @Input() rowData: any;
}
