import { Request, Response, NextFunction, Router } from 'express';
import { HandlerManagers } from './handler-managers';
import { IProductModel, ICustomError } from '../inventory-model';
import { productValidationSchema, uuidValidationSchema } from '../utilities/validation-schemas';
import { modelValidator, modelValidatorByField } from '../server-config/middleware';
export class InventoryCommandHandlers extends HandlerManagers {
    constructor(router: Router) {
        super();
        router.post('/create', modelValidator(productValidationSchema), this.addProduct.bind(this));
        router.put('/delete', modelValidatorByField(uuidValidationSchema, ['ids']), this.deleteProduct.bind(this));
    }
    addProduct(req: Request, res: Response, next: NextFunction): void {
        let product: IProductModel = req.body;
        this.inventoryCommandManager.addProduct(product).subscribe((result) => {
            res.status(201).send(result);
            return next();
        }, (err: ICustomError) => {
            res.status(err.status!).send(err.customError);
            return next(err);
        });
    }
    deleteProduct(req: Request, res: Response, next: NextFunction): void {
        let productIds: Array<string> = req.body.ids;
        this.inventoryCommandManager.deleteProduct(productIds).subscribe((isDeleted) => {
            let status: number = (isDeleted) ? 200 : 404;
            return res.status(status).send(isDeleted);
        }, (err: ICustomError) => {
            res.status(err.status!).send(err.customError);
            return;
        });
    }
}
