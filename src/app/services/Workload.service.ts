import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErrorService } from '../services/error.service';
import { Workload } from '../models/workload';

@Injectable({
    providedIn: 'root',
})
export class WorkloadService {
    constructor(
        private readonly http: HttpClient,
        private readonly errorService: ErrorService) { }
    private readonly baseUrl: string = `${environment.apiUrl}/workload`;

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    create(data: Workload) {
        return this.http.post<any>(this.baseUrl, data, this.httpOptions).pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getByCustomerId(id: number): Observable<{ status: boolean, data: Workload[]; }> {
        return this.http.get<any>(`${this.baseUrl}/customer/${id}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getById(id: number): Observable<{ status: boolean, data: Workload; }> {
        return this.http.get<any>(`${this.baseUrl}/${id}`, this.httpOptions).pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    update(id: any, data: Workload[]) {
        return this.http.put<any>(`${this.baseUrl}/${id}`, data, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    workloadActivation(id: number): Observable<{ status: boolean, data: string; }> {
        return this.http.post<any>(`${this.baseUrl}/${id}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getOrdersFromWorkload(id: number): Observable<{
        status: boolean, data: { patientId: number, orderId: number; orderCode: string; }[];
    }> {
        return this.http.get<any>(`${this.baseUrl}/orders/${id}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getAll(limit: number): Observable<{ status: boolean, data: Workload; }> {
        // tslint:disable-next-line: max-line-length
        return this.http.get<any>(`${this.baseUrl}/?limit=${limit}`, this.httpOptions).pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getWorkloadStatus(id: number): Observable<{ status: boolean, data: string; }> {
        // tslint:disable-next-line: max-line-length
        return this.http.get<any>(`${this.baseUrl}/status/${id}`, this.httpOptions).pipe(retry(1), catchError(this.errorService.errorHandler));
    }

}
