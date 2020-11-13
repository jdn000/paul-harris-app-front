import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErrorService } from '../services/error.service';
import { Tube } from '../models/tube';

@Injectable({
    providedIn: 'root',
})
export class TubeService {

    constructor(
        private readonly http: HttpClient,
        private readonly errorService: ErrorService
    ) { }

    private readonly baseUrl: string = `${environment.apiUrl}/tubes`;

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    getAll(): Observable<{ status: boolean, data: Tube[] }> {
        return this.http.get<{ status: boolean, data: Tube[] }>(this.baseUrl, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getById(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/${id}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    add(data: any) {
        return this.http.post<any>(this.baseUrl, data, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    update(id: any, data: any) {
        return this.http.put<any>(`${this.baseUrl}/${id}`, data, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getTubesByRequestedFields(parameters: object): Observable<any> {
        let params = new HttpParams();
        if (parameters['customerCenterId']) {
            params = params.append('customerCenterId', parameters['customerCenterId']);
        }
        if (parameters['turnId']) {
            params = params.append('turnId', parameters['turnId']);
        }
        if (parameters['workloadId']) {
            params = params.append('workloadId', parameters['workloadId']);
        }
        if (parameters['state']) {
            params = params.append('state', parameters['state']);
        }
        if (parameters['startDate']) {
            params = params.append('startDate', parameters['startDate']);
        }
        if (parameters['endDate']) {
            params = params.append('endDate', parameters['endDate']);
        }
        return this.http.get<any>(`${this.baseUrl}/search/q`, {params: params}).pipe(retry(1),
            catchError(this.errorService.errorHandler));
    }

    tubesRejection(data: any) {
        return this.http.post<any>(`${this.baseUrl}/rejection`, data, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    tubesReception(data: any) {
        return this.http.post<any>(`${this.baseUrl}/reception`, data, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

}
