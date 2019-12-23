import { userValidator } from './middleware';
import { Router, Application } from 'express';
import { InventoryCommandHandlers, InventoryQueryHandlers, AccountCommandHandler } from '../handlers';

export class ConfigureServer {
    protected readonly productPath: string = '/inventory/product';
    protected readonly accountPath: string = '/account/user'
    constructor(app: Application) {
        app.use(this.productPath, userValidator, this.configureInventoryCommandRoutes);
        app.use(this.productPath, userValidator, this.configureInventoryQueryRoutes);
        app.use(this.accountPath, this.configureAccountCommandHandler);
    }
    protected get configureInventoryCommandRoutes(): Router {
        let commandRouter: Router = Router();
        new InventoryCommandHandlers(commandRouter);
        return commandRouter;
    }
    protected get configureInventoryQueryRoutes(): Router {
        let queryRouter: Router = Router();
        new InventoryQueryHandlers(queryRouter);
        return queryRouter;
    }
    protected get configureAccountCommandHandler(): Router {
        let commandRouter: Router = Router();
        new AccountCommandHandler(commandRouter);
        return commandRouter;
    }
}

