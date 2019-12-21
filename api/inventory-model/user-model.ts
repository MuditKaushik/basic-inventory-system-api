import joi from '@hapi/joi';

export interface ILoginModel {
    username: string;
    password: string;
}

export let LoginValidationSchema = joi.object<ILoginModel>({
    username: joi.string().trim().required(),
    password: joi.string().trim().required()
});

export let userIdValidationSchema = joi.object<{ id: string }>({
    id: joi.string().trim().required().uuid({ version: ['uuidv1', 'uuidv2', 'uuidv3', 'uuidv4', 'uuidv5'] })
}); 
