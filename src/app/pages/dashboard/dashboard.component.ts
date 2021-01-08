import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

  constructor(private router: Router) { }
  userRole: number;
  btnClick1 = function () {
    this.router.navigateByUrl('/pages/core/alumn');
  };
  btnClick2 = function () {
    this.router.navigateByUrl('/pages/core/objective');
  };
  btnClick3 = function () {
    this.router.navigateByUrl('/pages/core/calification');
  };
  btnClick4 = function () {
    this.router.navigateByUrl('/pages/core/report');
  };
  btnClick5 = function () {
    this.router.navigateByUrl('/pages/core/result');
  };
  btnClick6 = function () {
    this.router.navigateByUrl('/pages/core/my-grade');
  };
  btnClick7 = function () {
    this.router.navigateByUrl('/pages/administration/user');
  };
  btnClick8 = function () {
    this.router.navigateByUrl('/pages/administration/semester');
  };
  btnClick9 = function () {
    this.router.navigateByUrl('/pages/administration/grade');
  };
  getRole() {
    return Number(localStorage.getItem('roleId'));
  }





}
