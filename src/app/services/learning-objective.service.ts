import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LearningObjective } from '../models/learningObjective';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class LearningObjectiveService {


  constructor(
    private readonly http: HttpClient,
    private readonly errorService: ErrorService) { }

  private readonly baseUrl: string = `${environment.apiUrl}/objective`;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };


  getAll(): Observable<LearningObjective[]> {
    return this.http.get<LearningObjective[]>(this.baseUrl, this.httpOptions).pipe(retry(1), catchError(this.errorService.errorHandler));
  }

  getById(id: number): Observable<LearningObjective> {
    return this.http.get<LearningObjective>(this.baseUrl + `/${id}`, this.httpOptions).pipe(retry(1), catchError(this.errorService.errorHandler));
  }

  getBySubjectId(subjectId: number): Observable<LearningObjective[]> {
    return this.http.get<LearningObjective[]>(this.baseUrl + `/subject/${subjectId}`, this.httpOptions).pipe(retry(1), catchError(this.errorService.errorHandler));
  }

  getGradeAndSubjectId(gradeId: number, subjectId: number): Observable<LearningObjective[]> {
    return this.http.get<LearningObjective[]>(this.baseUrl + `/grade/${gradeId}/subject/${subjectId}`, this.httpOptions).pipe(retry(1), catchError(this.errorService.errorHandler));
  }

  add(data: LearningObjective) {
    return this.http.post<any>(this.baseUrl, data, this.httpOptions).pipe(retry(1), catchError(this.errorService.errorHandler));
  }

  update(id: number, data: LearningObjective) {
    return this.http.put<any>(this.baseUrl + `/${id}`, data, this.httpOptions).pipe(retry(1), catchError(this.errorService.errorHandler));
  }




}
