import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ErrorService {

    constructor() { }

    errorHandler(error: any) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = error.error.message;
        } else if (error.status === 403) {
            errorMessage = 'Usuario o contraseña incorrectos';
        } else if (error.status === 0) {
            errorMessage = 'Error de conexión con el servidor';
        } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
        } else if (error.error && error.error.errors) {
            errorMessage = error.error.errors.message;
        } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(errorMessage);
    }

    getErrorMessage(error: any): string {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = error.error.message;
        } else if (error.status === 403) {
            errorMessage = 'Usuario o contraseña incorrectos';
        } else if (error.status === 0) {
            errorMessage = 'Error de conexión con el servidor';
        } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
        } else if (error.error && error.error.errors) {
            errorMessage = error.error.errors.message;
        } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return errorMessage;
    }
}
