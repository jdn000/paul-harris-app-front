/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { MENU_ITEMS } from './pages/pages-menu';

@Component({
  selector: 'ngx-app',
  template: `
    <router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {

  menu = MENU_ITEMS;
  context_items = [
    { title: 'Profile' },
    { title: 'Logout', link: 'auth/logout' },
  ];

  constructor() { }

  ngOnInit(): void { }

}
