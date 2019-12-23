import { IResult, ConnectionPool, TYPES } from 'mssql';
import { Observable, from, of } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { IInventoryDBContext, InventoryDBContext } from '../inventory-db/db-context';

const userQuery: string = `
SELECT 
    id,
    firstName,
    middleName,
    lastName,
    email,
    username
FROM 
    users \n`;

export interface IAccountContext {
    getUserByUserId(userId: string): Observable<IResult<any>>;
    getUserByCredentials(username: string, password: string): Observable<IResult<any>>;
    getUserByEmail(email: string): Observable<IResult<any>>;
    getUserByUsername(username: string): Observable<IResult<any>>;
}
export class AccountContext implements IAccountContext {
    private readonly _dbContext: IInventoryDBContext;
    constructor() {
        this._dbContext = new InventoryDBContext();
    }
    getUserByUserId(userId: string): Observable<IResult<any>> {
        let connection: ConnectionPool;
        let queryByUserId = userQuery.concat('WHERE id = @userId');
        return this._dbContext.getConnection().pipe(
            flatMap((pool: ConnectionPool) => {
                connection = pool;
                let queryRequest = connection.request()
                    .input('userId', TYPES.NVarChar, userId);
                return from(queryRequest.query(queryByUserId));
            }),
            flatMap((dbResult: IResult<any>) => {
                return from(connection.close()).pipe(map(isclosed => dbResult));
            })
        );
    }
    getUserByCredentials(username: string, password: string): Observable<IResult<any>> {
        let connection: ConnectionPool;
        let queryByCredentials = userQuery.concat('WHERE (username = @username OR email = @username) AND password = @password');
        return this._dbContext.getConnection()
            .pipe(
                flatMap((dbConnection: ConnectionPool) => {
                    connection = dbConnection;
                    let request = connection
                        .request()
                        .input('username', TYPES.NVarChar, username)
                        .input('password', TYPES.NVarChar, password);
                    return from(request.query(queryByCredentials));
                }),
                flatMap((dbResult) => {
                    return from(connection.close()).pipe(map((isClosed) => {
                        return dbResult;
                    }));
                })
            );
    }
    getUserByEmail(email: string): Observable<IResult<any>> {
        let connection: ConnectionPool;
        let queryByEmail = userQuery.concat('WHERE email = @email');
        return this._dbContext.getConnection().pipe(
            flatMap((pool: ConnectionPool) => {
                connection = pool;
                let queryRequest = connection.request()
                    .input('email', TYPES.NVarChar, email);
                return from(queryRequest.query(queryByEmail));
            }),
            flatMap((dbResult: IResult<any>) => {
                return from(connection.close()).pipe(map(isclosed => dbResult));
            })
        );
    }
    getUserByUsername(username: string): Observable<IResult<any>> {
        let connection: ConnectionPool;
        let queryByUsername = userQuery.concat('WHERE id = @username');
        return this._dbContext.getConnection().pipe(
            flatMap((pool: ConnectionPool) => {
                connection = pool;
                let queryRequest = connection.request()
                    .input('username', TYPES.NVarChar, username);
                return from(queryRequest.query(queryByUsername));
            }),
            flatMap((dbResult: IResult<any>) => {
                return from(connection.close()).pipe(map(isclosed => dbResult));
            })
        );
    }
}
