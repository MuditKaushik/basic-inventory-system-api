import { Request, Response, NextFunction, Router } from 'express';
import { HandlerManagers } from './handler-managers';
import { IProductModel, ICustomError } from '../inventory-model';
import { productValidationSchema, uuidValidationSchema } from '../utilities/validation-schemas';
import { modelValidator, paramValidator } from '../server-config/middleware';
export class InventoryCommandHandlers extends HandlerManagers {
    constructor(router: Router) {
        super();
        router.post('/create', modelValidator(productValidationSchema), this.addProduct.bind(this));
        router.delete('/:id', paramValidator(uuidValidationSchema, ['id']), this.deleteProduct.bind(this));
    }
    addProduct(req: Request, res: Response, next: NextFunction): void {
        let product: IProductModel = req.body;
        this.inventoryCommandManager.addProduct(product).subscribe((result) => {
            res.status(200).send(result);
            return next();
        }, (err: ICustomError) => {
            res.status(err.status!).send(err.customError);
            return next(err);
        });
    }
    deleteProduct(req: Request, res: Response, next: NextFunction): void {
        let productId: string = req.params.id;
        this.inventoryCommandManager.deleteProduct(productId).subscribe((isDeleted) => {
            let status: number = (isDeleted) ? 200 : 404;
            return res.status(status).send(isDeleted);
        }, (err: ICustomError) => {
            res.status(err.status!).send(err.customError);
            return;
        });
    }
}
