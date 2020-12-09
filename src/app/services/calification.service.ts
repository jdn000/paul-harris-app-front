import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErrorService } from './error.service';
import { BatchCalifications, Calification, CalificationCummulative } from '../models/calification';



@Injectable({
  providedIn: 'root'
})
export class CalificationService {

  constructor(

    private readonly http: HttpClient,
    private readonly errorService: ErrorService
  ) { }

  private readonly baseUrl: string = `${environment.apiUrl}/calification`;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };


  getAll(): Observable<Calification[]> {
    return this.http
      .get<Calification[]>(this.baseUrl, this.httpOptions)
      .pipe(retry(1), catchError(this.errorService.errorHandler));
  }

  getById(id: number): Observable<BatchCalifications> {
    return this.http
      .get<any>(this.baseUrl + `/${id}`, this.httpOptions)
      .pipe(retry(1), catchError(this.errorService.errorHandler));
  }
  getByAlumnId(alumnId: number): Observable<Calification[]> {
    return this.http
      .get<any>(this.baseUrl + `/alumn/${alumnId}`, this.httpOptions)
      .pipe(retry(1), catchError(this.errorService.errorHandler));
  }
  getByGradeAndSubjectId(gradeId: number, subjectId: number): Observable<Calification[]> {
    return this.http
      .get<any>(this.baseUrl + `/grade/${gradeId}/subject/${subjectId}`, this.httpOptions)
      .pipe(retry(1), catchError(this.errorService.errorHandler));
  }
  getCummulativeByGradeAndSubjectId(gradeId: number, subjectId: number): Observable<CalificationCummulative[]> {
    return this.http
      .get<any>(this.baseUrl + `/cummulative/grade/${gradeId}/subject/${subjectId}`, this.httpOptions)
      .pipe(retry(1), catchError(this.errorService.errorHandler));
  }

  getCummulativeByCalificationId(calificationId: number): Observable<Calification[]> {
    return this.http
      .get<any>(this.baseUrl + `/cummulative/calification/${calificationId}`, this.httpOptions)
      .pipe(retry(1), catchError(this.errorService.errorHandler));
  }

  getCummulativeByCalificationIdAlumnId(calificationId: number, alumnId: number): Observable<Calification[]> {
    return this.http
      .get<any>(this.baseUrl + `/cummulative/calification/${calificationId}/alumn/${alumnId}`, this.httpOptions)
      .pipe(retry(1), catchError(this.errorService.errorHandler));
  }

  add(data: BatchCalifications) {
    return this.http
      .post<any>(this.baseUrl, data, this.httpOptions)
      .pipe(retry(1), catchError(this.errorService.errorHandler));
  }
  addCummulatives(data: BatchCalifications) {
    return this.http
      .post<any>(this.baseUrl + `/cummulative`, data, this.httpOptions)
      .pipe(retry(1), catchError(this.errorService.errorHandler));
  }
  update(data: Calification[]) {
    return this.http
      .put<any[]>(this.baseUrl, data, this.httpOptions)
      .pipe(retry(1), catchError(this.errorService.errorHandler));
  }

  updateCummulatives(data: Calification[]) {
    return this.http
      .put<any[]>(this.baseUrl + `/cummulative`, data, this.httpOptions)
      .pipe(retry(1), catchError(this.errorService.errorHandler));
  }

}




/*
@Get('/')
@UseBefore(middlewares.isAuth)
async getAll(): Promise<Calification[]> {
  return this.calificationService.getAll();

}
@Get('/:id')
@UseBefore(celebrate(validators.calification.get))
@UseBefore(middlewares.isAuth)
async getById(@Param('id') id: number): Promise<Calification> {
  return this.calificationService.getById(id);
}

@Get('/BatchCalifications/:BatchCalificationsId/')
@UseBefore(celebrate(validators.calification.getByBatchCalificationsId))
@UseBefore(middlewares.isAuth)
async getByGradeIdAndSubjectId(@Param('BatchCalificationsId') BatchCalificationsId: number): Promise<Calification[]> {
  return this.calificationService.getByBatchCalificationsId(BatchCalificationsId);
}
@Post('/')
@UseBefore(celebrate(validators.calification.post))
@UseBefore(middlewares.isAuth)
async post(@Body() data: BatchCalifications): Promise<BatchCalifications> {
  return this.calificationService.create(data);
}

@Put('/:id')
@UseBefore(celebrate(validators.calification.put))
@UseBefore(middlewares.isAuth)
async put(@Param('id') id: number, @Body() params: Calification): Promise<Calification> {
  params.id = id;
  return this.calificationService.update(params);

}*/