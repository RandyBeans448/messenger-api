import * as Joi from 'joi';

export const configValidationSchema: Joi.ObjectSchema<any> = Joi.object({
    TYPEORM_HOST: Joi.string().required(),
    TYPEORM_PORT: Joi.number().required(),
    TYPEORM_USERNAME: Joi.string().required(),
    TYPEORM_PASSWORD: Joi.string().required(),
    TYPEORM_DATABASE: Joi.string().required(),
});