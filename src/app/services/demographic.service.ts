import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Demographic, DemographicItems } from '../models/demographic';
import { ErrorService } from '../services/error.service';

@Injectable({
    providedIn: 'root',
})
export class DemographicService {

    constructor(
        private http: HttpClient,
        private errorService: ErrorService
    ) { }

    private baseUrl: string = `${environment.apiUrl}/demographic`;

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    getAll(): Observable<{ status: boolean, data: Demographic[]; }> {
        return this.http
            .get<{ status: boolean, data: Demographic[]; }>(this.baseUrl, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getById(id: number): Observable<any> {
        return this.http
            .get<any>(this.baseUrl + `/${id}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }
    getByUse(use: string): Observable<any> {
        return this.http
            .get<any>(this.baseUrl + `/use/${use}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
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

    getDemographicItems(id: number): Observable<{ status: boolean, data: DemographicItems[]; }> {
        return this.http
            .get<any>(this.baseUrl + `/${id}/items`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    addDemographicItems(id: any, data: any) {
        return this.http
            .post<any>(this.baseUrl + `/${id}/items`, data, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    editDemographicItems(id: any, itemsId: any, data: any) {
        return this.http
            .put<any>(this.baseUrl + `/${id}/items/${itemsId}`, data, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

}
