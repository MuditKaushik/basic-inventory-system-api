import { CorsOptions } from 'cors';
import { Router, Application } from 'express';
import { InventoryCommandHandlers, InventoryQueryHandlers } from '../inventory-handlers';

export class ConfigureServer {
    protected readonly productPath: string = '/inventory/product';
    constructor(app: Application) {
        app.use(this.productPath, this.configureInventoryCommandRoutes);
        app.use(this.productPath, this.configureInventoryQueryRoutes);
    }
    get cors(): CorsOptions {
        return {
            allowedHeaders: '*',
            preflightContinue: false,
            methods: ['GET', 'PUT', 'POST', 'DELETE'],
            exposedHeaders: 'location',
            optionsSuccessStatus: 200,
            maxAge: 3200,
            origin: '*'
        }
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
}

