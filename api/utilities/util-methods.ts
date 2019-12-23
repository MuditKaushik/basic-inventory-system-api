import { Request } from 'express';
import { ObjectSchema } from '@hapi/joi';
import { IModelError } from '../server-config/middleware';

export function getBearerToken(req: Request): string {
    let headerToken = req.headers.authorization;
    let bearerString = 'bearer';
    if (headerToken) {
        let token = headerToken.match(new RegExp(`${bearerString}`, 'gi'));
        if (token && token.length > 0) {
            headerToken = headerToken.replace(bearerString, '');
        }
        return headerToken.trim();
    } else {
        return '';
    }
}

export function validateModel(schema: ObjectSchema, requestObject: any) {
    let modelErrors: Array<IModelError> = new Array<IModelError>();
    let validation = schema.validate(requestObject, { convert: false });
    if (validation.error) {
        modelErrors = validation.error.details.map((detail) => {
            return <IModelError>{
                field: detail.context?.key!,
                message: detail.message
            }
        });
    }
    return modelErrors;
}
