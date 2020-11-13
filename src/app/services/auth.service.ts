import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErrorService } from '../services/error.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private http: HttpClient,
        private errorService: ErrorService) { }

    private baseUrl: string = environment.apiUrl + '/auth';

    /*httpOptions = {
        headers: new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
    };*/

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    login(data): Observable<any> {
        return this.http.post<any>(this.baseUrl + '/signin', data, this.httpOptions).pipe(
            retry(1),
            catchError(this.errorService.errorHandler),
        );
    }
    resetPassword(id: number, data: any): Observable<any> {
        return this.http.put<any>(this.baseUrl + `/reset-password/${id}`, data, this.httpOptions).pipe(
            retry(1),
            catchError(this.errorService.errorHandler),
        );
    }

}
