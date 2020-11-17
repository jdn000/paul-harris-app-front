import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErrorService } from './error.service';
import { Alumn } from '../models/alumn';


@Injectable({
    providedIn: 'root',
})
export class AlumnService {

    constructor(
        private readonly http: HttpClient,
        private readonly errorService: ErrorService) { }

    private readonly baseUrl: string = `${environment.apiUrl}/alumn`;

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };


    getAll(): Observable<Alumn[]> {
        return this.http
            .get<Alumn[]>(this.baseUrl, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getById(id: number): Observable<Alumn> {
        return this.http
            .get<any>(this.baseUrl + `/${id}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }
    getByRun(run: string): Observable<Alumn> {
        return this.http
            .get<any>(this.baseUrl + `/run/${run}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    add(data: Alumn) {
        return this.http
            .post<any>(this.baseUrl, data, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    update(id: number, data: Alumn) {
        return this.http
            .put<any>(this.baseUrl + `/${id}`, data, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }



}
