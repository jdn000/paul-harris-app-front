import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErrorService } from '../services/error.service';
import { TestResult } from '../models/testResult';

@Injectable({
    providedIn: 'root',
})
export class TestResultService {
    constructor(
        private readonly http: HttpClient,
        private readonly errorService: ErrorService) { }
    private readonly baseUrl: string = `${environment.apiUrl}/result`;

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    create(data: TestResult[]) {
        return this.http.post<any>(this.baseUrl, data, this.httpOptions).pipe(retry(1),
            catchError(this.errorService.errorHandler));
    }

    getByOrderId(id: number): Observable<{ status: boolean, data: TestResult[]; }> {
        return this.http.get<any>(`${this.baseUrl}/${id}`, this.httpOptions).pipe(retry(1),
            catchError(this.errorService.errorHandler));
    }
    getResultsByOrderId(id: number): Observable<TestResult[]> {
        return this.http.get<any>(`${this.baseUrl}/order/${id}`, this.httpOptions).pipe(retry(1),
            catchError(this.errorService.errorHandler));
    }

    update(data: TestResult[]) {
        return this.http.put<any>(`${this.baseUrl}`, data, this.httpOptions).pipe(retry(1),
            catchError(this.errorService.errorHandler));
    }
    updateSingleResult(data: TestResult, id: number) {
        return this.http.put<any>(`${this.baseUrl}/${id}`, data, this.httpOptions).pipe(retry(1),
            catchError(this.errorService.errorHandler));
    }
    validateResults(data: TestResult[]) {
        return this.http.put<any>(`${this.baseUrl}/validate/test`, data, this.httpOptions).pipe(retry(1),
            catchError(this.errorService.errorHandler));
    }

    getLastResult(patientId: number, testId: number, date: string): Observable<TestResult> {
        let params = new HttpParams();
        params = params.append('patientId', String(patientId));
        params = params.append('testId', String(testId));
        params = params.append('date', date);
        return this.http.get<any>(`${this.baseUrl}/patient/test/`, { params: params }).pipe(retry(1),
            catchError(this.errorService.errorHandler));
    }
}

