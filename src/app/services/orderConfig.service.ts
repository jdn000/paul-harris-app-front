import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErrorService } from './error.service';
import { OrderConfig } from '../models/orderConfig';

@Injectable({
    providedIn: 'root',
})
export class OrderConfigService {
    constructor(
        private readonly http: HttpClient,
        private readonly errorService: ErrorService) { }

    private readonly baseUrl: string = environment.apiUrl + '/config/order';

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };


    getById(id: number): Observable<{ status: boolean; data: OrderConfig; }> {
        return this.http
            .get<{ status: boolean; data: OrderConfig; }>(this.baseUrl + `/${id}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }
    getAll(): Observable<{ status: boolean; data: OrderConfig[]; }> {
        return this.http
            .get<{ status: boolean; data: OrderConfig[]; }>(this.baseUrl, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }
    add(data: OrderConfig) {
        return this.http
            .post<OrderConfig>(this.baseUrl, data, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    update(id: number, data: OrderConfig) {
        return this.http
            .put<{ id: number, data: OrderConfig; }>(this.baseUrl + `/${id}`, data, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }


}
