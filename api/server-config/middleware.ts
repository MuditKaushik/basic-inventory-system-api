import { ObjectSchema } from '@hapi/joi';
import { map } from 'rxjs/operators';
import { getBearerToken, validateModel } from '../utilities/util-methods';
import { Request, Response, NextFunction } from 'express';
import { HandlerManagers } from '../handlers/handler-managers';
import { userValidationSchema } from '../utilities/validation-schemas';

export interface IModelError {
    field: string;
    message: string;
}

export let modelValidator = function (validationSchema: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction): void => {
        let validationErrors = validateModel(validationSchema, req.body);
        if (validationErrors.length > 0) {
            res.status(400).send(validationErrors);
            return next(validationErrors);
        }
        next();
    }
}

export let paramValidator = function (validationSchema: ObjectSchema, params: Array<string>) {
    return (req: Request, res: Response, next: NextFunction): void => {
        let validationErrors: Array<IModelError> = new Array<IModelError>();
        for (let i = 0; i < params.length; i++) {
            let objects: any = {};
            objects[params[i]] = req.param(params[i]);
            validationErrors.push(...validateModel(validationSchema, objects));
        }
        if (validationErrors.length > 0) {
            res.status(400).send(validationErrors);
            return next(validationErrors);
        }
        next();
    }
}

export function userValidator(req: Request, res: Response, next: NextFunction): void {
    let manager = new HandlerManagers();
    let token = getBearerToken(req);
    if (token) {
        manager.accountQueryManager.getUserByUserId(token).pipe(
            map((user) => {
                let validationError: Array<IModelError> = new Array<IModelError>();
                if (user != null) {
                    validationError = validateModel(userValidationSchema, user);
                } else {
                    validationError.push({
                        field: 'user',
                        message: 'Invalid user'
                    });
                }
                return validationError;
            })
        ).subscribe((error: Array<IModelError>) => {
            if (error.length > 0) {
                res.status(401).send(error);
                return next(error);
            }
            next();
        });
    }
    else {
        res.status(401).send('Unauthorized request');
        next('Unauthorized request');
    }
}
