import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorService } from './error.service';

import { Semester } from '../models/semester';


@Injectable({
  providedIn: 'root'
})
export class SemesterService {

  constructor(
    private readonly http: HttpClient,
    private readonly errorService: ErrorService) { }

  private readonly baseUrl: string = `${environment.apiUrl}/semester`;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };



  getAll(): Observable<Semester[]> {
    return this.http
      .get<Semester[]>(this.baseUrl, this.httpOptions)
      .pipe(retry(1), catchError(this.errorService.errorHandler));
  }

  getCurrentSemester(): Observable<Semester> {
    return this.http
      .get<Semester>(this.baseUrl + `/current`, this.httpOptions)
      .pipe(retry(1), catchError(this.errorService.errorHandler));
  }


  update(id: number, data: Semester) {
    return this.http
      .put<Semester>(this.baseUrl + `/${id}`, data, this.httpOptions)
      .pipe(retry(1), catchError(this.errorService.errorHandler));
  }

  sync(gradeId: number) {
    return this.http
      .post<Semester>(this.baseUrl + `/sync/${gradeId}`, this.httpOptions)
      .pipe(retry(1), catchError(this.errorService.errorHandler));
  }
  async isFirstSemester() {
    const sem = await this.getCurrentSemester().toPromise();
    if (sem.code % 2 === 0) {
      return false;
    } else {
      return true;
    }

  }
}
