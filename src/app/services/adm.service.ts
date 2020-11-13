import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErrorService } from '../services/error.service';
import { AdmRegion, AdmProvince, AdmCommune } from '../models/adm';

@Injectable({
    providedIn: 'root',
})
export class AdmService {
    constructor(
        private readonly http: HttpClient,
        private readonly errorService: ErrorService) { }
    private readonly baseUrl: string = `${environment.apiUrl}/adm`;

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    getAllRegions(): Observable<AdmRegion[]> {
        return this.http.get<any>(`${this.baseUrl}/region/`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getRegionById(id: number): Observable<AdmRegion> {
        return this.http.get<any>(`${this.baseUrl}/region/${id}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getAllProvincesByRegionId(id: number): Observable<AdmProvince[]> {
        // tslint:disable-next-line: max-line-length
        return this.http.get<any>(`${this.baseUrl}/region/${id}/province`, this.httpOptions).pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getAllCommunesByProvinceId(id: number, provId: number): Observable<AdmCommune[]> {
        // tslint:disable-next-line: max-line-length
        return this.http.get<any>(`${this.baseUrl}/region/${id}/province/${provId}/commune`, this.httpOptions).pipe(retry(1), catchError(this.errorService.errorHandler));
    }

}
