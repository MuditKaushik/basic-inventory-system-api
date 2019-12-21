import { Observable, from } from 'rxjs';
import { ConnectionPool, Transaction, PreparedStatement, config, IOptions, Request } from 'mssql';
import { development } from './config/config.json';

export interface IInventoryDBContext {
    getConnection(): Observable<ConnectionPool>;
    getTransactionConnection(connection: ConnectionPool): Transaction;
    getPreparedStatement(connection: ConnectionPool | Transaction): PreparedStatement;
}
export class InventoryDBContext implements IInventoryDBContext {
    getConnection(): Observable<ConnectionPool> {
        return from(this.dbConnect.connect());
    }
    getPreparedStatement(connection: ConnectionPool | Transaction): PreparedStatement {
        return (connection instanceof ConnectionPool) ?
            new PreparedStatement(connection) :
            new PreparedStatement(connection);
    }
    getTransactionConnection(connection: ConnectionPool): Transaction {
        return new Request(connection).transaction;
    }
    private get dbConnect(): ConnectionPool {
        let connectionOption: IOptions = {
            camelCaseColumns: true,
            connectTimeout: 2000,
            abortTransactionOnError: true,
            encrypt: true,
            useUTC: true
        };
        let dbConfig: config = {
            user: development.username,
            password: development.password,
            database: development.database,
            server: development.host,
            connectionTimeout: 20000,
            requestTimeout: 20000,
            pool: {
                min: 5,
                max: 20
            },
            options: connectionOption
        };
        return new ConnectionPool(dbConfig);
    }
}
