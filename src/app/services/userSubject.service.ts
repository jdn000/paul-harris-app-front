import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErrorService } from './error.service';
import { UserSubject } from '../models/user';


@Injectable({
    providedIn: 'root',
})
export class UserSubjectService {

    constructor(
        private readonly http: HttpClient,
        private readonly errorService: ErrorService) { }

    private readonly baseUrl: string = `${environment.apiUrl}/userSubject`;

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };


    getAll(): Observable<UserSubject[]> {
        return this.http
            .get<UserSubject[]>(this.baseUrl, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getByUserId(id: number): Observable<UserSubject[]> {
        return this.http
            .get<UserSubject[]>(this.baseUrl + `/${id}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    add(data: UserSubject) {
        return this.http
            .post<UserSubject>(this.baseUrl, data, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    delete(id: number) {
        return this.http
            .delete<boolean>(this.baseUrl + `/${id}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }



}
