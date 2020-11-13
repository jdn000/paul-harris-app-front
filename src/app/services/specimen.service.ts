import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErrorService } from '../services/error.service';

@Injectable({
    providedIn: 'root',
})
export class SpecimenService {
    constructor(
        private http: HttpClient,
        private errorService: ErrorService) { }

    private baseUrl: string = environment.apiUrl + '/specimens';

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    getAll(): Observable<any> {
        return this.http
        .get<any>(this.baseUrl, this.httpOptions)
        .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getById(id: number): Observable<any> {
        return this.http
        .get<any>(this.baseUrl + `/${id}`, this.httpOptions)
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

}
