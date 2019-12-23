import { Request, Response, NextFunction, Router } from 'express';
import { uuidValidationSchema } from '../utilities/validation-schemas';
import { HandlerManagers } from './handler-managers';
import { paramValidator } from '../server-config/middleware';
import { ICustomError } from '../inventory-model';
export class InventoryQueryHandlers extends HandlerManagers {
    constructor(router: Router) {
        super();
        router.get('/:id', paramValidator(uuidValidationSchema, ['id']), this.getUserProducts.bind(this));
    }
    getUserProducts(req: Request, res: Response, next: NextFunction): void {
        let userId = req.params.id;
        this.inventoryQueryManager.getInventoryProductsByUserId(userId).subscribe((result) => {
            res.status(200).send(result);
            return next();
        }, (err: ICustomError) => {
            res.status(err.status!).send(err);
            return next(err);
        });
    }
}
