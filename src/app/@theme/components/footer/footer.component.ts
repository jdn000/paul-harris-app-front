import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      <a href="www.mnd.cl">Merge & Deploy © 2020</a>
    </span>
  `,
})
export class FooterComponent {
}
