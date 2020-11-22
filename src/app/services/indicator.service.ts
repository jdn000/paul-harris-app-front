import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErrorService } from './error.service';
import { Indicator } from '../models/indicator';


@Injectable({
    providedIn: 'root',
})
export class IndicatorService {

    constructor(
        private readonly http: HttpClient,
        private readonly errorService: ErrorService) { }

    private readonly baseUrl: string = `${environment.apiUrl}/indicator`;

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };


    getAll(): Observable<Indicator[]> {
        return this.http
            .get<Indicator[]>(this.baseUrl, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getById(id: number): Observable<Indicator> {
        return this.http
            .get<Indicator>(this.baseUrl + `/${id}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }
    getByObjectiveId(objectiveId: number): Observable<Indicator[]> {
        return this.http
            .get<Indicator[]>(this.baseUrl + `/objective/${objectiveId}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    add(data: Indicator) {
        return this.http
            .post<Indicator>(this.baseUrl, data, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    update(id: number, data: Indicator) {
        return this.http
            .put<Indicator>(this.baseUrl + `/${id}`, data, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }



}
