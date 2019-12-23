import { InventoryQueryContext, IInventoryQueryContext } from '../inventory-context/inventory-query-context';
import { Observable } from 'rxjs';
import { errorLogger } from '../utilities/error-logger';
import { map, catchError } from 'rxjs/operators';
import { IResult } from 'mssql';
import { IProductModel } from '../inventory-model';
export interface IInventoryQueryService {
    getInventoryProductsByUserId(userId: string): Observable<Array<IProductModel>>;
}
export class InventoryQueryService implements IInventoryQueryService {
    private readonly _queryContext: IInventoryQueryContext;
    constructor() {
        this._queryContext = new InventoryQueryContext();
    }
    getInventoryProductsByUserId(userId: string): Observable<Array<IProductModel>> {
        let products: Array<IProductModel> = new Array<IProductModel>();
        return this._queryContext.getInventoryProductsByUserId(userId).pipe(
            map((userProducts: IResult<any>) => {
                for (let product of userProducts.recordsets[0]) {
                    products.push({
                        id: product.id,
                        userid: product.userid,
                        description: product.description,
                        name: product.name,
                        price: product.price,
                        image: product.image
                    });
                }
                return products;
            }),
            catchError(err => errorLogger({ actualError: err, message: 'Error in inventory-query-service', method: 'getInventoryProductsByUserId' }))
        );
    }
}
