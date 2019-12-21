import { IInventoryDBContext, InventoryDBContext } from '../inventory-db/db-context';
import { Observable, merge, from } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { ConnectionPool, IResult, TYPES } from 'mssql';

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
        let query = 'SELECT id,name,description,price,image from products where userid = @userId';
        return this.dbContext.getConnection().pipe(map((connection) => {
            dbConnection = connection;
        }), flatMap(() => {
            let request = dbConnection.request();
            request.input('userId', TYPES.UniqueIdentifier, userid);
            return from(request.query(query));
        }), flatMap((dbData) => {
            return from(dbConnection.close()).pipe(map(() => {
                return dbData;
            }));
        }));
    }
}
