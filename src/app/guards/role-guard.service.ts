import { Injectable } from '@angular/core';
import {
  CanActivate,
  Route,
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';


import { ToastService } from '../services/toast.service';
@Injectable()
export class RoleGuardService implements CanActivate {
  constructor(

    private router: Router,
    private toastService: ToastService
  ) { }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const idModule = route.data.roleId;
    const currentRoleId = Number(localStorage.getItem('roleId'));
    if (idModule === currentRoleId) {
      return true;
    }
    this.toastService.showInfo(
      'No autorizado para acceder a este módulo',
    );
    this.router.navigate(['/pages/dashboard']);

    return false;
  }
}
