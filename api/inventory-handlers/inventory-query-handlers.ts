import { Request, Response, NextFunction, Router } from 'express';
import { InventoryManager } from './inventory-manager';

export class InventoryQueryHandlers extends InventoryManager {
    constructor(router: Router) {
        super();
        router.get('/', this.sayHello.bind(this));
    }
    sayHello(req: Request, res: Response, next: NextFunction): void {
        this.queryManager.getInventoryProductsByUserId('1').subscribe((result) => {
            res.status(200).send('Working');
            return;
        });
    }
}
