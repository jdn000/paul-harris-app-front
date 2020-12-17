import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErrorService } from './error.service';
import { Alumn } from '../models/alumn';
import { CalificationReport } from '../models/calification';


@Injectable({
    providedIn: 'root',
})
export class ReportService {

    constructor(
        private readonly http: HttpClient,
        private readonly errorService: ErrorService) { }

    private readonly baseUrl: string = `${environment.apiUrl}/report`;

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };



    createReport(gradeNumber: number): Observable<any> {
        return this.http
            .post<any>(this.baseUrl + `/${gradeNumber}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    downloadReport(id: number): Observable<any> {
        return this.http.get(this.baseUrl + `/${id}/download`, { responseType: 'blob' })
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    createSingleReport(id: number): Observable<any> {
        return this.http
            .get<any>(this.baseUrl + `/alumn/${id}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }



}


