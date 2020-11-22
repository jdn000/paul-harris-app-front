import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorService } from './error.service';

import { Subject } from '../models/subject';


@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  constructor(
    private readonly http: HttpClient,
    private readonly errorService: ErrorService) { }

  private readonly baseUrl: string = `${environment.apiUrl}/subject`;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };



  getAll(): Observable<Subject[]> {
    return this.http
      .get<Subject[]>(this.baseUrl, this.httpOptions)
      .pipe(retry(1), catchError(this.errorService.errorHandler));
  }

}
