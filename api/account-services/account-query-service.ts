import { IAccountContext, AccountContext } from '../account-context/account-query-context';
import { IUserModel, ILoginModel } from '../inventory-model';
import { emailValidationSchema } from '../utilities/validation-schemas';
import { IResult } from 'mssql';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { validateModel } from '../utilities/util-methods';

export interface IAccountQueryService {
    getUserByCredentials(login: ILoginModel): Observable<IUserModel | null>;
    getUserByEmailOrUsername(userIdentifier: string): Observable<IUserModel | null>;
    getUserByUserId(userId: string): Observable<IUserModel | null>;
}
export class AccountQueryService implements IAccountQueryService {
    private readonly _accountContext: IAccountContext;
    constructor() {
        this._accountContext = new AccountContext();
    }
    getUserByCredentials(login: ILoginModel): Observable<IUserModel | null> {
        let authUser: IUserModel | null = null;
        return this._accountContext.getUserByCredentials(login.username, login.password).pipe(
            map((result: IResult<any>) => {
                if (result.rowsAffected.length > 0) {
                    for (let user of result.recordset) {
                        authUser = <IUserModel>{
                            id: user.id,
                            email: user.email,
                            firstName: user.firstName,
                            middleName: user.middleName,
                            lastName: user.lastName,
                            username: user.username
                        };
                    }
                }
                return authUser;
            })
        );
    }
    getUserByEmailOrUsername(userIdentifier: string): Observable<IUserModel | null> {
        let authUser: IUserModel | null = null;
        let emailValidationError = validateModel(emailValidationSchema, { email: userIdentifier });
        let getUserObservable$: Observable<IResult<any>> = (emailValidationError.length === 0) ?
            this._accountContext.getUserByEmail(userIdentifier) :
            this._accountContext.getUserByUsername(userIdentifier);
        return getUserObservable$.pipe(
            map((result: IResult<any>) => {
                if (result.rowsAffected.length > 0) {
                    for (let user of result.recordset) {
                        authUser = <IUserModel>{
                            id: user.id,
                            email: user.email,
                            firstName: user.firstName,
                            middleName: user.middleName,
                            lastName: user.lastName,
                            username: user.username
                        };
                    }
                }
                return authUser;
            })
        );
    }
    getUserByUserId(userId: string): Observable<IUserModel | null> {
        let authUser: IUserModel | null = null;
        return this._accountContext.getUserByUserId(userId).pipe(
            map((result: IResult<any>) => {
                if (result.rowsAffected.length > 0) {
                    for (let user of result.recordset) {
                        authUser = <IUserModel>{
                            id: user.id,
                            email: user.email,
                            firstName: user.firstName,
                            middleName: user.middleName,
                            lastName: user.lastName,
                            username: user.username
                        };
                    }
                }
                return authUser;
            })
        );
    }
}
