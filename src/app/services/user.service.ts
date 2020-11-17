import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErrorService } from '../services/error.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private readonly http: HttpClient,
    private readonly errorService: ErrorService) { }

  private readonly baseUrl: string = environment.apiUrl + '/user';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getAll(): Observable<User[]> {
    return this.http
      .get<User[]>(this.baseUrl, this.httpOptions)
      .pipe(retry(1), catchError(this.errorService.errorHandler));
  }

  getById(id: number): Observable<User> {
    return this.http
      .get<User>(this.baseUrl + `/${id}`, this.httpOptions)
      .pipe(retry(1), catchError(this.errorService.errorHandler));
  }

  add(data: User) {
    return this.http
      .post<User>(this.baseUrl, data, this.httpOptions)
      .pipe(retry(1), catchError(this.errorService.errorHandler));
  }

  update(id: any, data: User) {
    return this.http
      .put<User>(this.baseUrl + `/${id}`, data, this.httpOptions)
      .pipe(retry(1), catchError(this.errorService.errorHandler));
  }

  // login(data): Observable<any> {
  //   return this.http.post<any>(this.baseUrl + '/auth/signin', data, this.httpOptions).pipe(
  //     retry(1),
  //     catchError(this.errorService.errorHandler),
  //   );
  // }

}
