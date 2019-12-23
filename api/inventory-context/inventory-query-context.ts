import { IInventoryDBContext, InventoryDBContext } from '../inventory-db/db-context';
import { Observable, from } from 'rxjs';
import { map, flatMap, catchError } from 'rxjs/operators';
import { ConnectionPool, IResult, TYPES } from 'mssql';
import { errorLogger } from '../utilities/error-logger';

export interface IInventoryQueryContext {
    getInventoryProductsByUserId(userid: string): Observable<IResult<any>>;
}

export class InventoryQueryContext implements IInventoryQueryContext {
    readonly dbContext: IInventoryDBContext;
    constructor() {
        this.dbContext = new InventoryDBContext();
    }
    getInventoryProductsByUserId(userid: string): Observable<IResult<any>> {
        let dbConnection: ConnectionPool;
        let query = `
        SELECT 
            id,userid,name,description,price,image 
        FROM 
            products 
        WHERE 
            userid = @userId`;
        return this.dbContext.getConnection().pipe(
            map((connection) => {
                dbConnection = connection;
            }), flatMap(() => {
                let request = dbConnection.request();
                request.input('userId', TYPES.UniqueIdentifier, userid);
                return from(request.query(query));
            }), flatMap((dbData) => {
                return from(dbConnection.close()).pipe(map(() => {
                    return dbData;
                }));
            }),
            catchError(err => errorLogger({ actualError: err, message: 'Error in inventory-query-context', method: 'getInventoryProductsByUserId' }))
        );
    }
}
