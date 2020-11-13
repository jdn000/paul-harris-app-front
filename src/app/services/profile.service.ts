import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErrorService } from '../services/error.service';
import { Profile } from '../models/profile';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {

    constructor(
        private readonly http: HttpClient,
        private readonly errorService: ErrorService) { }

    readonly baseUrl: string = `${environment.apiUrl}/profile`;

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    getAll(): Observable<{ status: boolean; data: Profile[] }> {
        return this.http
            .get<{ status: boolean; data: Profile[] }>(this.baseUrl, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getById(id: number): Observable<{ status: boolean; data: Profile }> {
        return this.http
            .get<{ status: boolean; data: Profile }>(this.baseUrl + `/${id}`, this.httpOptions)
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
