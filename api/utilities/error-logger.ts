import { Observable, throwError } from 'rxjs';
import { ICustomError } from '../inventory-model';
export function errorLogger(error: ICustomError): Observable<any> {
    console.log('actual detailed error', error.actualError);
    error.customError = error.customError || {
        message: error.message,
        name: `method name is '${error.method}'.`
    };
    error.status = error.status || 500;
    return throwError(error);
}
