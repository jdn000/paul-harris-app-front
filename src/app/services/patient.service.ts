import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErrorService } from '../services/error.service';
import { Patient } from '../models/patient';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root',
})
export class PatientService {
    constructor(
        private http: HttpClient,
        private errorService: ErrorService) { }

    private baseUrl: string = `${environment.apiUrl}/patient`;

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    getByRequestedParams(parameters: object): Observable<{ status: boolean; data: Patient[]; }> {
        let params = new HttpParams();
        params = params.append('searchQuery', parameters['searchQuery']);
        if (parameters['customerCenterId']) {
            params = params.append('customerCenterId', parameters['customerCenterId']);
        }
        return this.http.get<{ status: boolean; data: Patient[]; }>(this.baseUrl + `/search/q`, { params: params }).pipe(retry(1),
            catchError(this.errorService.errorHandler));
    }

    getAll(): Observable<{ status: boolean; data: Patient[] }> {
        return this.http
            .get<{ status: boolean; data: Patient[] }>(this.baseUrl, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getById(id: number): Observable<{ status: boolean, data: Patient }> {
        return this.http
            .get<{ status: boolean, data: Patient }>(this.baseUrl + `/${id}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getLast(): Observable<any> {
        return this.http
            .get<any>(this.baseUrl + `/all/last`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getByCustomerId(customerId: number): Observable<any> {
        return this.http
            .get<any>(this.baseUrl + `/customer/${customerId}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getByCustomerAndTurn(customerId: number, turnId: number): Observable<any> {
        return this.http
            .get<any>(this.baseUrl + `/customer/${customerId}/${turnId}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    /**
     * Crea un nuevo paciente en API
     * @param {Patient} data
     * @returns {Observable<Patient>}
     * @memberof PatientService
     */
    add(data: Patient): Observable<Patient> {
        return this.http
            .post<Patient>(this.baseUrl, data, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    /**
     * Actualiza los datos de un paciente
     * @param {number} id
     * @param {Patient} data
     * @returns {Observable<Patient>}
     * @memberof PatientService
     */
    update(id: number, data: Patient): Observable<{ status: boolean; data: Patient; }> {
        return this.http
            .put<{ status: boolean; data: Patient; }>(this.baseUrl + `/${id}`, data, this.httpOptions)
            .pipe(catchError(this.errorService.errorHandler));
    }

    getAllFree(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/free/all/`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    getByPatientDocument(document: string): Observable<Patient> {
        return this.http.get<Patient>(`${this.baseUrl}/document/${document}`, this.httpOptions)
            .pipe(retry(1), catchError(this.errorService.errorHandler));
    }

    /**
     * Dada un objeto Date retorna los años transcurridos hasta el día actual
     * @param birthdate
     */
    getAgeFromBirthdate(birthdate: Date): number {
        const bdate = moment(birthdate);
        if (bdate.isValid()) {
            return moment().diff(bdate, 'years', false);
        }
    }

}
