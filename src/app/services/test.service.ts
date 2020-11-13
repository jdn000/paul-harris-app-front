import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErrorService } from '../services/error.service';
import { Test } from '../models/test';

@Injectable({
    providedIn: 'root',
})
export class TestService {

    constructor(
        private readonly http: HttpClient,
        private readonly errorService: ErrorService) { }

    private readonly baseUrl: string = `${environment.apiUrl}/tests`;

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    getAll(): Observable<{ status: boolean; data: Test[]; }> {
        return this.http
            .get<{ status: boolean; data: Test[]; }>(this.baseUrl, this.httpOptions)
            .pipe(catchError(this.errorService.errorHandler));
    }

    getLastVersionByTestId(id: number): Observable<{ data: Test, status: boolean; }> {
        return this.http
            .get<any>(this.baseUrl + `/version/${id}`, this.httpOptions)
            .pipe(catchError(this.errorService.errorHandler));
    }
    getById(id: number): Observable<{ data: Test, status: boolean; }> {
        return this.http
            .get<any>(this.baseUrl + `/${id}`, this.httpOptions)
            .pipe(catchError(this.errorService.errorHandler));
    }
    add(data: any) {
        return this.http
            .post<any>(this.baseUrl, data, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    update(id: any, data: any) {
        return this.http
            .put<any>(this.baseUrl + `/${id}`, data, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getAllTestVersion(): Observable<any> {
        return this.http
            .get<any>(this.baseUrl + `/all-versions/`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

}
