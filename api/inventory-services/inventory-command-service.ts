import { IInventoryCommandContext, InventoryCommandContext } from '../inventory-context/inventory-command-context';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IProductModel } from '../inventory-model';

export interface IInventoryCommandService {
    addProduct(product: IProductModel): Observable<boolean>;
    deleteProduct(productIds: Array<string>): Observable<boolean>;
}
export class InventoryCommandService implements IInventoryCommandService {
    private readonly _commandContext: IInventoryCommandContext;
    constructor() {
        this._commandContext = new InventoryCommandContext();
    }
    addProduct(product: IProductModel): Observable<boolean> {
        return this._commandContext.addProduct(product).pipe(map(isCreated => isCreated));
    }
    deleteProduct(productIds: Array<string>): Observable<boolean> {
        return this._commandContext.deleteProduct(productIds).pipe(map(isDeleted => isDeleted));
    }
}
