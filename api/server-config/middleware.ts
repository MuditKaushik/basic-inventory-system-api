import { ObjectSchema } from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';
import { InventoryManager } from '../inventory-handlers/inventory-manager';

export interface IModelError {
    field: string;
    message: string;
}

export let modelValidator = function (validationSchema: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction): void => {
        let validationErrors = validateModel(validationSchema, req.body);
        if (validationErrors.length > 0) {
            res.status(401).send(validationErrors);
            return next(validationErrors);
        }
        return next();
    }
}

export function userValidator(req: Request, res: Response, next: NextFunction): void {
    let manager = new InventoryManager();
    let token = getBearerToken(req);
    if (token) {
        manager.queryManager.getInventoryProductsByUserId(token)
            .subscribe((exists) => {
                if (!exists) {
                    res.status(403).send('forbidden');
                    return next('forbidden');
                } else {
                    next();
                }
            });
    }
    else {
        res.status(401).send('Unauthorized request');
        return next('Unauthorized request');
    }
}

function getBearerToken(req: Request): string {
    let headerToken = req.headers.authorization;
    let bearerString = 'bearer';
    if (headerToken) {
        let token = headerToken.match(new RegExp(`${bearerString}`, 'gi'));
        if (token && token.length > 0)
            headerToken = headerToken.replace(bearerString, '');
        return headerToken.trim();
    } else {
        return '';
    }
}

function validateModel(schema: ObjectSchema, requestObject: any) {
    let modelErrors: Array<IModelError> = new Array<IModelError>();
    let validationErrors = schema.validate(requestObject, { convert: false });
    modelErrors = validationErrors.error.details.map((detail) => {
        return <IModelError>{
            field: detail.context?.key!,
            message: detail.message
        }
    });
    return modelErrors;
}
