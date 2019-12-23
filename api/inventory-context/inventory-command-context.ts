import { ConnectionPool, IProcedureResult, PreparedStatement, Transaction, TYPES } from 'mssql';
import { from, Observable } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';
import * as uuid from 'uuid';
import { IInventoryDBContext, InventoryDBContext } from '../inventory-db/db-context';
import { IProductModel } from '../inventory-model';
import { errorLogger } from '../utilities/error-logger';

export interface IInventoryCommandContext {
    addProduct(product: IProductModel): Observable<boolean>;
    deleteProduct(productIds: Array<string>): Observable<boolean>;
}
export class InventoryCommandContext implements IInventoryCommandContext {
    private readonly _dbContext: IInventoryDBContext;
    constructor() {
        this._dbContext = new InventoryDBContext();
    }
    addProduct(product: IProductModel): Observable<boolean> {
        let createProductQuery: string = `
        INSERT INTO products(id,userid,name,description,price,image)
        VALUES(@productId,@userId,@name,@description,@price,@image)
        `;
        let connection: ConnectionPool, transaction: Transaction, preparedStatement: PreparedStatement, isCreated: boolean = false;
        return this._dbContext.getConnection().pipe(
            map((dbConnection: ConnectionPool) => {
                connection = dbConnection;
                transaction = connection.transaction();
                preparedStatement = this._dbContext.getPreparedStatement(transaction);
                preparedStatement
                    .input('productId', TYPES.UniqueIdentifier)
                    .input('userId', TYPES.UniqueIdentifier)
                    .input('name', TYPES.NVarChar)
                    .input('description', TYPES.Text)
                    .input('price', TYPES.NVarChar)
                    .input('image', TYPES.NVarChar);
            }),
            flatMap(() => {
                return from(transaction.begin()).pipe(flatMap((isBegin) => from(preparedStatement.prepare(createProductQuery))));
            }),
            flatMap(() => {
                let executCommand = preparedStatement.execute({
                    productId: uuid.v4(),
                    userId: product.userid,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    image: product.image
                });
                return from(executCommand);
            }),
            flatMap((dbResult) => {
                return from(preparedStatement.unprepare()).pipe(map(() => {
                    isCreated = (dbResult.rowsAffected.length > 0) ? true : false;
                }));
            }),
            flatMap(() => {
                let endTransactionObservable$: Observable<void> = (isCreated) ? from(transaction.commit()) : from(transaction.rollback());
                return endTransactionObservable$.pipe(flatMap(transactionDone => from(connection.close()))).pipe(map(result => isCreated));
            }),
            catchError(err => errorLogger({ actualError: err, message: 'Error in inventory-command-context', method: 'addProduct' }))
        );
    }
    deleteProduct(productIds: Array<string>): Observable<boolean> {
        let deleteProductCommand: string = `DELETE FROM products WHERE id in (@productIds)`;
        let connection: ConnectionPool, transaction: Transaction, preparedStatement: PreparedStatement, isDeleted: boolean = false;
        return this._dbContext.getConnection().pipe(
            map((dbConnection: ConnectionPool) => {
                connection = dbConnection;
                transaction = connection.transaction();
                preparedStatement = this._dbContext.getPreparedStatement(transaction);
                preparedStatement.input('productIds', TYPES.UniqueIdentifier);
            }),
            flatMap(() => {
                return from(transaction.begin()).pipe(flatMap(isbegin => from(preparedStatement.prepare(deleteProductCommand))));
            }),
            flatMap(() => {
                return from(preparedStatement.execute({ productIds: productIds.join(',') }));
            }),
            flatMap((result: IProcedureResult<any>) => {
                isDeleted = (result.rowsAffected[0] > 0);
                return from(preparedStatement.unprepare());
            }),
            flatMap(() => {
                let endTransactionObservable$: Observable<void> = (isDeleted) ? from(transaction.commit()) : from(transaction.rollback());
                return endTransactionObservable$.pipe(flatMap(transactionDone => from(connection.close())), map(isClosed => isDeleted));
            }),
            catchError(err => errorLogger({ actualError: err, message: 'Error in inventory-command-context', method: 'deleteProduct' }))
        );
    }
}
