import { InventoryQueryContext, IInventoryQueryContext } from '../inventory-context/inventory-query-context';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResult } from 'mssql';
export interface IInventoryQueryService {
    getInventoryProductsByUserId(userId: string): Observable<any>;
}
export class InventoryQueryService implements IInventoryQueryContext {
    private readonly _queryContext: IInventoryQueryContext;
    constructor() {
        this._queryContext = new InventoryQueryContext();
    }
    getInventoryProductsByUserId(userId: string): Observable<any> {
        return this._queryContext.getInventoryProductsByUserId(userId).pipe(map((products: IResult<any>) => {
            if (products.rowsAffected.length > 0)
                return products.recordsets[0];
            else
                return {};
        }));
    }
}
