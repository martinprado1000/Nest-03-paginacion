import * as Joi from 'joi';

export const envSchema = Joi.object({ 
  // PORT: Joi.number().required(),
  PORT: Joi.number().default(3000), // Asigno por default en 3000 en el caso que no lo pasen
  DATABASE_URI: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().allow('', null),
  DATABASE_PASSWORD: Joi.string().allow('', null),
});
