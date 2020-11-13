import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErrorService } from './error.service';
import { Module } from '../models/module';
import { RoleModule } from '../models/roleModule';

@Injectable({
    providedIn: 'root',
})
export class RoleService {
    baseUrl: string = environment.apiUrl;
    modules: Module[] = [];
    roleModules: RoleModule[] = [];
    constructor(private http: HttpClient, private errorService: ErrorService) { }

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    };
    /////////////////////////////   Role   //////////////////////////////
    getAll(): Observable<any> {
        return this.http
            .get<any>(this.baseUrl + '/role', this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getById(id: number): Observable<any> {
        return this.http
            .get<any>(this.baseUrl + ` '/role'/${id}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    add(data: any) {
        return this.http
            .post<any>(this.baseUrl + '/role', data, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }
    update(id: any, data: any) {
        return this.http
            .put<any>(this.baseUrl + `/role/${id}`, data, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }
    ///////////////////////////   Module   ///////////////////////////

    getModuleById(id: number): Observable<any> {
        return this.http
            .get<any>(this.baseUrl + `/module/${id}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }
    getAllModules(): Observable<any> {
        return this.http
            .get<any>(this.baseUrl + '/module', this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }
    ///////////////////////////  Role-module  ///////////////////////////
    getAllRoleModule(): Observable<any> {
        return this.http
            .get<any>(this.baseUrl + '/role/role-modules/all-role-modules', this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getRoleModuleById(id: number): Observable<any> {
        return this.http
            .get<any>(this.baseUrl + `/role/role-module/${id}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }
    getRoleModuleByIdModule(moduleId: number): Observable<any> {
        return this.http
            .get<any>(this.baseUrl + `/role/role-module/module/${moduleId}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }
    getRoleModuleByIdRole(roleId: number): Observable<any> {
        return this.http
            .get<any>(this.baseUrl + `/role/role-module/role/${roleId}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    addRoleModule(data: any) {
        return this.http
            .post<any>(this.baseUrl + '/role/role-module', data, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    updateRoleModule(id: any, data: any) {
        return this.http
            .put<any>(this.baseUrl + `/role/role-module/${id}`, data, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }
    deleteRoleModule(id: any) {
        return this.http
            .delete<any>(this.baseUrl + `/role/role-module/${id}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

}
