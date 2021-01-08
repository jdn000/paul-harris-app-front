import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErrorService } from './error.service';

import { Grade } from '../models/grade';

@Injectable({
    providedIn: 'root',
})
export class GradeService {

    constructor(
        private readonly http: HttpClient,
        private readonly errorService: ErrorService) { }

    private readonly baseUrl: string = `${environment.apiUrl}/grade`;

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    getAll(): Observable<Grade[]> {
        return this.http
            .get<Grade[]>(this.baseUrl, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    update(id: number, data: Grade) {
        return this.http
            .put<Grade>(this.baseUrl + `/${id}`, data, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }


}
