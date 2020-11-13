import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErrorService } from '../services/error.service';
import { CustomerCenter } from '../models/customer';
import { Test } from '../models/test';
import { Turn } from '../models/turn';

@Injectable({
    providedIn: 'root',
})
export class CustomerService {

    constructor(
        private http: HttpClient,
        private errorService: ErrorService) { }

    private baseUrl: string = `${environment.apiUrl}/customers`;

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };


    getAll(): Observable<{ status: boolean; data: CustomerCenter[] }> {
        return this.http
            .get<{ status: boolean; data: CustomerCenter[] }>(this.baseUrl, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getById(id: number): Observable<{ status: boolean; data: CustomerCenter }> {
        return this.http
            .get<any>(this.baseUrl + `/${id}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getTestsByCustomerId(id: number): Observable<Test[]> {
        return this.http
            .get<any>(this.baseUrl + `/${id}/test`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getTurnsByCustomerId(id: number): Observable<Turn[]> {
        return this.http
            .get<any>(this.baseUrl + `/${id}/turn`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    add(data: CustomerCenter) {
        return this.http
            .post<any>(this.baseUrl, data, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    update(id: number, data: CustomerCenter) {
        return this.http
            .put<any>(this.baseUrl + `/${id}`, data, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getActives(): Observable<any> {
        return this.http
            .get<any>(this.baseUrl + `/status/active`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }
    getInactives(): Observable<any> {
        return this.http
            .get<any>(this.baseUrl + `/status/inactive`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

}
