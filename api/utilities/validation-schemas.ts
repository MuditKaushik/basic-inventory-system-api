import joi from '@hapi/joi';
import { ILoginModel, IProductModel, IUserModel } from '../inventory-model';

const allUUIDVersions: Array<joi.GuidVersions> = ['uuidv1', 'uuidv2', 'uuidv3', 'uuidv4', 'uuidv5'];

export let uuidValidationSchema = joi.object<{ id: string }>({
    id: joi.string().trim().uuid({ version: allUUIDVersions })
});

export let productValidationSchema = joi.object<IProductModel>({
    id: joi.optional(),
    image: joi.optional(),
    userid: joi.string().trim().required().uuid({ version: allUUIDVersions }),
    description: joi.string().trim().required(),
    name: joi.string().trim().required(),
    price: joi.string().trim().required()
});

export let loginValidationSchema = joi.object<ILoginModel>({
    username: joi.string().trim().required(),
    password: joi.string().trim().required()
});

export let userValidationSchema = joi.object<IUserModel>({
    id: joi.string().trim().required().uuid({ version: allUUIDVersions }),
    firstName: joi.string().trim().required(),
    lastName: joi.string().trim().required(),
    username: joi.string().trim().required(),
    email: joi.string().trim().email().required(),
    middleName: joi.string().trim().optional()
});

export let emailValidationSchema = joi.object<{ email: string }>({
    email: joi.string().trim().email()
});
