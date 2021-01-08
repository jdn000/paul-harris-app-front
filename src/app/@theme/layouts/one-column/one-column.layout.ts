import { Component } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout windowMode>
      <nb-layout-header fixed>
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar" state="compacted" tag="menu-sidebar" responsive>
        <ng-content select="nb-menu" autoCollapse="true"></ng-content>
      </nb-sidebar>

      <nb-layout-column (click)="collapseSidebar()">
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent {
  constructor(private sidebarService: NbSidebarService) { }
  collapseSidebar(): boolean {
    this.sidebarService.compact('menu-sidebar');
    return false;
  }
}
