import joi from '@hapi/joi';

export interface IProductModel {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string;
}

let productIdValidationSchema = joi.object<{ id: string }>({
    id: joi.string().trim().uuid({ version: ['uuidv1', 'uuidv2', 'uuidv3', 'uuidv4', 'uuidv5'] })
});

let productValidationSchema = joi.object<IProductModel>({
    id: joi.string().trim().optional(),
    description: joi.string().trim().required(),
    image: joi.string().trim().optional(),
    name: joi.string().trim().required(),
    price: joi.string().trim().required()
});
