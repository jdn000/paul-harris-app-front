import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErrorService } from '../services/error.service';
import { Order } from '../models/order';

@Injectable({
    providedIn: 'root',
})
export class OrderService {
    constructor(
        private readonly http: HttpClient,
        private readonly errorService: ErrorService) { }
    private readonly baseUrl: string = `${environment.apiUrl}/order`;

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    getById(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/${id}`, this.httpOptions).pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getByOrderCode(code: string): Observable<{ status: boolean; data: Order }> {
        return this.http
            .get<{ status: boolean; data: Order }>(`${this.baseUrl}/code/${code}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    /**
     * Realiza request para creación de nueva orden en API
     * @param {Order} data
     * @returns {Observable<{ status: boolean; data: Order }>}
     * @memberof OrderService
     */
    add(data: Order): Observable<{ status: boolean; data: Order }> {
        return this.http.post<{ status: boolean; data: Order }>(this.baseUrl, data, this.httpOptions)
            .pipe(catchError(this.errorService.errorHandler));
    }

    update(id: any, data: any) {
        return this.http
            .put<any>(`${this.baseUrl}/${id}`, data, this.httpOptions)
            .pipe(catchError(this.errorService.errorHandler));
    }


}
