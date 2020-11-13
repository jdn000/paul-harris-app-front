import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErrorService } from './error.service';
import { Printer } from '../models/printer';

@Injectable({
    providedIn: 'root',
})
export class PrinterService {
    constructor(
        private readonly http: HttpClient,
        private readonly errorService: ErrorService) { }

    private readonly baseUrl: string = environment.apiUrl + '/printer';

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    getAll(): Observable<any> {
        return this.http
            .get<{ status: boolean; data: Printer[]; }>(this.baseUrl, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getById(id: number): Observable<any> {
        return this.http
            .get<{ status: boolean; data: Printer; }>(this.baseUrl + `/${id}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    add(data: any) {
        return this.http
            .post<Printer>(this.baseUrl, data, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    update(id: number, data: Printer) {
        return this.http
            .put<{ id: number, data: Printer; }>(this.baseUrl + `/${id}`, data, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

}
